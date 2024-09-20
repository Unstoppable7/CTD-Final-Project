const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
   name: {
      type: String,
      required: [true, "Please provide a name"],
      maxlength: [20, "Name must be less than 20 characters"],
   },
   email: {
      type: String,
      required: [true, "Please provide an email"],
      match: [
         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
         "Please provide a valid email",
      ],
      unique: true,
   },
   password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 6,
   },
});

userSchema.pre("save", async function () {
   const salt = await bcrypt.genSalt();
   this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (canditatePassword) {
   const isMatch = await bcrypt.compare(canditatePassword, this.password);
   return isMatch;
};

userSchema.methods.createJWT = async function () {
   return new Promise((resolve, reject) => {
      jwt.sign(
         {
            userID: this._id, userName: this.name
         },
         process.env.JWT_SECRET,
         { expiresIn: process.env.JWT_LIFETIME },
         (err, token) => {
            if (err) {
               reject(err);
            }
            resolve(token);
         }
      );
   });
};

module.exports = model("User", userSchema);
