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
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

app.use(express.json());
app.use(cookieParser(process.env.AUTH_COOKIE_SECRET));
app.use(
   cors({
      origin: `${process.env.CLIENT_URL}`,
      methods: ["GET", "POST", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
   })
);

app.use(
   rateLimiter({
      windowMs: 15 * 60 * 1000, 
      max: 100,
   })
);
app.use(helmet());
app.use(xss());


app.use(process.env.API_BASE_URL_V1 + process.env.API_AUTH_URL, authRouter);

app.use(
   process.env.API_BASE_URL_V1 + process.env.API_TASKS_URL,
   authMiddleware,
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
