const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const errorTypes = require("../errors/errorTypes");
const authMiddleware = require("../middleware/auth");

const signup = async (req, res, next) => {
   try {
      const user = await User.create(req.body);
      const token = await user.createJWT();

      res.cookie(process.env.AUTH_COOKIES_NAME, token, {
         encode: String,
         expires: new Date(
            Date.now() + process.env.AUTH_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
         ),
         httpOnly: true,
         path: "/",
         secure: false,
         signed: false,
      });
      res.status(StatusCodes.CREATED).json({
         message: "User created successfully",
      });
   } catch (error) {
      return next(error);
   }
};

const signin = async (req, res, next) => {
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
      res.cookie(process.env.AUTH_COOKIES_NAME, token, {
         encode: String,
         expires: new Date(
            Date.now() + process.env.AUTH_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
         ),
         httpOnly: true,
         path: "/",
         secure: false,
         signed: false,
      });
      res.status(StatusCodes.OK).json({
         message: `${user.name} successfully logged in`,
      });
   } catch (error) {
      return next(error);
   }
};

const signout = async (req, res, next) => {
   try {
      res.clearCookie(process.env.AUTH_COOKIES_NAME);
      res.status(StatusCodes.OK).json({
         message: "Successfully logged out ",
      });
   } catch (error) {
      next(error);
   }
};

const authCheck = (req, res) => {
   authMiddleware(req, res, () => {
      res.status(StatusCodes.OK).json({
         message: "Authenticated",
         user: req.user,
      });
   });
};

module.exports = { signup, signin, signout, authCheck };
