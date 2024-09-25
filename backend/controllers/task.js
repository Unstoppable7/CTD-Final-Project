const Task = require("../models/task");

const getAll = async (req, res) => {
   const allTasks = await Task.find({ createdBy: req.auth.userID }).sort({
      priority: "desc",
   });

   res.status(200).json({ allTasks });
};

const getDetails = async (req, res) => {
   const {
      params: { id: taskId },
      auth: { userID: userID },
   } = req;

   const task = await Task.findOne({ _id: taskId, createdBy: userID });
   if (!task) {
      return res.status(404).json({ msg: `Task id: ${taskId} not found` });
   }

   const taskResponse = {
      ...task.toObject(),
      priority: task.priorityToString(task.priority),
   };

   res.status(200).json({ task: taskResponse });
};

const create = async (req, res) => {
   const { parentTaskId } = req.body;

   req.body.createdBy = req.auth.userID;

   req.body.priority = priorityToNumeric(req.body.priority);

   try {
      const newTask = await Task.create(req.body);
      if (parentTaskId) {
         const parentTask = await Task.findById(parentTaskId);
         if (parentTask) {
            parentTask.subTasks.push(newTask._id);
            await parentTask.save();
         }
      }
      res.status(201).json({ msg: "Task created successfully", task: newTask });
   } catch (error) {
      return res.status(500).json(error.message);
   }
};

const update = async (req, res) => {
   const {
      params: { id: taskId },
      auth: { userID: userID },
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
         return res.status(404).json({ msg: "User not found" });
      }

      return res
         .status(200)
         .json({ msg: "Task successfully updated", task: task });
   } catch (error) {
      return res.status(500).json(error.message);
   }
};

const remove = async (req, res) => {
   const {
      params: { parentTaskId: parentTaskId, taskId: taskId },
      auth: { userID: userID },
   } = req;

   try {
      await deleteTaskAndSubtasks(taskId, userID);

      if (parentTaskId !== "0") {
         const parentTask = await Task.findById(parentTaskId);

         if (parentTask) {
            const subTaskIndex = parentTask.subTasks.indexOf(taskId);

            if (subTaskIndex !== -1) {
               parentTask.subTasks.splice(subTaskIndex, 1);

               await parentTask.save();
            }
         }
      }

      return res.status(200).json({ msg: "Task successfully deleted" });
   } catch (error) {
      return res.status(500).json(error.message);
   }
};

const deleteTaskAndSubtasks = async (taskId, userID) => {
   try {
      const task = await Task.findOne({ _id: taskId, createdBy: userID });

      //TODO error handling
      if (!task) {
         throw new Error("Task not found");
      }

      for (const subTaskId of task.subTasks) {
         await deleteTaskAndSubtasks(subTaskId, userID);
      }

      await Task.findOneAndDelete({ _id: taskId, createdBy: userID });
   } catch (error) {
      console.error(`Error deleting task: ${error.message}`);
      throw error;
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
