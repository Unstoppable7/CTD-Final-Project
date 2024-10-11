const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskSchema = new Schema({
   title: {
      type: String,
      required: [true, "Please provide a title"],
   },

   description: String,

   parentTask: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      default: null,
   },

   subTasks: [
      {
         type: Schema.Types.ObjectId,
         ref: "Task",
      },
   ],

   dueDate: Date,

   priority: {
      type: Number,
      enum: [0, 1, 2, 3],
      default: 0,
   },

   objectives: {
      hours: {
         type: Number,
      },
      quantity: {
         type: Number,
      },
   },
   estimation: {
      hours: {
         type: Number,
      },
      quantity: {
         type: Number,
      },
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
   updatedAt: {
      type: Date,
   },
   createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "The task must be associated with a user"],
   },
});

taskSchema.pre("save", function (next) {
   this.updatedAt = Date.now();
   next();
});

taskSchema.methods.priorityToString = function (priorityNumeric) {
   switch (priorityNumeric) {
      case 3:
         return "high";
      case 2:
         return "medium";
      case 1:
         return "low";
      default:
         return "none";
   }
};

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
