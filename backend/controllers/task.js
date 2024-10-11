const Task = require("../models/task");
const errorTypes = require("../errors/errorTypes");
const { StatusCodes } = require("http-status-codes");

const getRootTasks = async (req, res) => {
   const rootTaskList = await Task.find({
      createdBy: req.user.id,
      parentTask: null,
   })
      .sort({
         priority: "desc",
      })
      .lean();

   res.status(StatusCodes.OK).json(
      rootTaskList.map((task) => ({
         ...task,
         priority: Task.prototype.priorityToString(task.priority),
      }))
   );
};

const getChildTasks = async (req, res) => {
   const {
      params: { id: parentTaskId },
      user: { id: userID },
   } = req;

   const childTaskList = await Task.find({
      createdBy: userID,
      parentTask: parentTaskId,
   })
      .sort({
         priority: "desc",
      })
      .lean();

   res.status(StatusCodes.OK).json(
      childTaskList.map((task) => ({
         ...task,
         priority: Task.prototype.priorityToString(task.priority),
      }))
   );
};

const getDetails = async (req, res, next) => {
   const {
      params: { id: taskId },
      user: { id: userID },
   } = req;

   try {
      const task = await Task.findOne({
         _id: taskId,
         createdBy: userID,
      }).lean();

      if (!task) {
         return next({
            name: errorTypes.NOT_FOUND,
            objInvolved: Task.modelName,
         });
      }

      res.status(StatusCodes.OK).json({
         task: {
            ...task,
            priority: Task.prototype.priorityToString(task.priority),
         },
      });
   } catch (error) {
      next(error);
   }
};
//TODO createChild, createRoot
const create = async (req, res, next) => {
   const { parentTask: parentTaskId } = req.body;

   req.body.createdBy = req.user.id;

   req.body.priority = priorityToNumeric(req.body.priority);

   try {
      let newTask = new Task(req.body);
      if (parentTaskId) {
         const parentTaskObj = await Task.findById(parentTaskId);

         if (!parentTaskObj) {
            return next({
               name: errorTypes.NOT_FOUND,
               objInvolved: `Parent ${Task.modelName}`,
            });
         }
         parentTaskObj.subTasks.push(newTask._id);
         await parentTaskObj.save();
      }
      await newTask.save();

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
         return next({
            name: errorTypes.NOT_FOUND,
            objInvolved: Task.modelName,
         });
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
      const error = await deleteTaskAndSubtasks(taskId, userID);
      if (error) {
         return next(error);
      }
      if (parentTaskId !== "0") {
         const parentTask = await Task.findById(parentTaskId);
         if (!parentTask) {
            return next({
               name: errorTypes.NOT_FOUND,
               objInvolved: `Parent ${Task.modelName}`,
            });
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

const deleteTaskAndSubtasks = async (taskId, userID) => {
   try {
      const task = await Task.findOne({ _id: taskId, createdBy: userID });

      if (!task) {
         return {
            name: errorTypes.NOT_FOUND,
            objInvolved: Task.modelName,
         };
      }
      for (const subTaskId of task.subTasks) {
         await deleteTaskAndSubtasks(subTaskId, userID);
      }
      await Task.findOneAndDelete({ _id: taskId, createdBy: userID });
   } catch (error) {
      return error;
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
module.exports = {
   getRootTasks,
   getChildTasks,
   getDetails,
   create,
   update,
   remove,
};
