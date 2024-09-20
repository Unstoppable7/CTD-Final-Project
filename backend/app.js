require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

const router = require("./routes/auth");

app.use(express.json());

app.use("/", router);

const start = async () => {
   try {
      await mongoose.connect(process.env.MONGO_URI);
      app.listen(port, () => {
         console.log(`Estoy escuchando en el puerto ${port}...`);
      });
   } catch (error) {
      console.log(error);
   }
};

start();
