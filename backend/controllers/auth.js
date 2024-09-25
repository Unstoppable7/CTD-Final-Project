const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");

const signup = async (req, res, next) => {
   try {
      const user = await User.create(req.body);
      const token = await user.createJWT();
      res.status(StatusCodes.CREATED).json({
         message: "User created successfully",
         token: token,
      });
   } catch (error) {
      return next(error);
   }
};

const login = async (req, res, next) => {
   const { email, password } = req.body;
   try {
      const user = await User.findOne({ email: email });
      if (!user) {
         return next(
            Object.assign(new Error(), {
               name: errorTypes.NOT_FOUND,
               objInvolved: User.modelName,
               message: "email does not match",
            })
         );
      }
      if (!(await user.comparePassword(password))) {
         return next(
            Object.assign(new Error(), {
               name: errorTypes.NOT_FOUND,
               objInvolved: User.modelName,
               message: "password does not match",
            })
         );
      }
      const token = await user.createJWT();
      return res.status(StatusCodes.OK).json({
         message: `${user.name} successfully logged in`,
         token: token,
      });
   } catch (error) {
      return next(error);
   }
};

module.exports = { signup, login };
