require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const authRouter = require("./routes/auth");
const taskRouter = require("./routes/task");
const errorHandler = require("./middleware/error-handler");
const cors = require("cors");
const authMiddleware = require("./middleware/auth");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());
app.use(
   cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
   })
);

app.use(process.env.API_BASE_URL_V1 + process.env.API_AUTH_URL, authRouter);

app.use(process.env.API_BASE_URL_V1 + process.env.API_TASKS_URL, authMiddleware, taskRouter);

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
