require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

const authRouter = require("./routes/auth");
const taskRouter = require("./routes/task");
const { expressjwt } = require("express-jwt");
const errorHandler = require("./middleware/error-handler");

app.use(express.json());

app.use("/", authRouter);
app.use(
   "/tasks",
   expressjwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] }),
   taskRouter
);

app.use(errorHandler);

const start = async () => {
   try {
      await mongoose.connect(process.env.MONGO_URI);
      app.listen(port, () => {
         console.log(`Listening on the port ${port}...`);
      });
   } catch (error) {
      console.log(error);
   }
};

start();
