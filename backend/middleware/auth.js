const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const authMiddleware = async (req, res, next) => {
   const token = req.cookies.authToken;

   if (!token) {
      return res
         .status(StatusCodes.UNAUTHORIZED)
         .json({ message: "Not authenticated" });
   }

   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
         return next(err);
      }
      req.user = { id: decoded.id, name: decoded.username };
      next();
   });
};

module.exports = authMiddleware;
