const Task = require("../models/task");
const errorTypes = require("../errors/errorTypes");
const { StatusCodes } = require("http-status-codes");

const getAll = async (req, res) => {
   const allTasks = await Task.find({ createdBy: req.user.id }).sort({
      priority: "desc",
   });
   
   res.status(StatusCodes.OK).json({ allTasks });
};

const getDetails = async (req, res, next) => {
   const {
      params: { id: taskId },
      user: { id: userID },
   } = req;

   const task = await Task.findOne({ _id: taskId, createdBy: userID });
   if (!task) {
      return next(
         Object.assign(new Error(), {
            name: errorTypes.NOT_FOUND,
            objInvolved: Task.modelName,
         })
      );
   }

   const taskResponse = {
      ...task.toObject(),
      priority: task.priorityToString(task.priority),
   };

   res.status(StatusCodes.OK).json({ task: taskResponse });
};

const create = async (req, res, next) => {
   const { parentTaskId } = req.body;

   req.body.createdBy = req.user.id;

   req.body.priority = priorityToNumeric(req.body.priority);

   try {
      const newTask = await Task.create(req.body);
      if (parentTaskId) {
         const parentTask = await Task.findById(parentTaskId);

         if (!parentTask) {
            return next(
               Object.assign(new Error(), {
                  name: errorTypes.NOT_FOUND,
                  objInvolved: `Parent ${Task.modelName}`,
               })
            );
         }
         parentTask.subTasks.push(newTask._id);
         await parentTask.save();
      }
      res.status(StatusCodes.CREATED).json({
         message: "Task created successfully",
         data: newTask,
      });
   } catch (error) {
      return next(error);
   }
};

const update = async (req, res, next) => {
   const {
      params: { id: taskId },
      user: { id: userID },
   } = req;

   if (req.body.priority) {
      req.body.priority = priorityToNumeric(req.body.priority);
   }

   try {
      const task = await Task.findOneAndUpdate(
         { _id: taskId, createdBy: userID },
         req.body,
         {
            new: true,
            runValidators: true,
         }
      );
      if (!task) {
         return next(
            Object.assign(new Error(), {
               name: errorTypes.NOT_FOUND,
               objInvolved: Task.modelName,
            })
         );
      }

      return res
         .status(StatusCodes.OK)
         .json({ message: "Task successfully updated", data: task });
   } catch (error) {
      return next(error);
   }
};

const remove = async (req, res, next) => {
   const {
      params: { parentTaskId: parentTaskId, taskId: taskId },
      user: { id: userID },
   } = req;

   try {
      await deleteTaskAndSubtasks(taskId, userID, next);
      if (parentTaskId !== "0") {
         const parentTask = await Task.findById(parentTaskId);
         if (!parentTask) {
            return next(
               Object.assign(new Error(), {
                  name: errorTypes.NOT_FOUND,
                  objInvolved: `Parent ${Task.modelName}`,
               })
            );
         }
         const subTaskIndex = parentTask.subTasks.indexOf(taskId);
         if (subTaskIndex !== -1) {
            parentTask.subTasks.splice(subTaskIndex, 1);
            await parentTask.save();
         }
      }
      return res
         .status(StatusCodes.OK)
         .json({ message: "Task successfully deleted" });
   } catch (error) {
      return next(error);
   }
};

const deleteTaskAndSubtasks = async (taskId, userID, next) => {
   try {
      const task = await Task.findOne({ _id: taskId, createdBy: userID });
      if (!task) {
         return next(
            Object.assign(new Error(), {
               name: errorTypes.NOT_FOUND,
               objInvolved: Task.modelName,
            })
         );
      }
      for (const subTaskId of task.subTasks) {
         await deleteTaskAndSubtasks(subTaskId, userID);
      }
      await Task.findOneAndDelete({ _id: taskId, createdBy: userID });
   } catch (error) {
      return next(error);
   }
};

const priorityToNumeric = (priorityString) => {
   switch (priorityString) {
      case "high":
         return 3;
      case "medium":
         return 2;
      case "low":
         return 1;
      default:
         return 0;
   }
};
module.exports = { getAll, getDetails, create, update, remove };
