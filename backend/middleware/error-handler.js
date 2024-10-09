const { StatusCodes } = require("http-status-codes");
const errorTypes = require("../errors/errorTypes");

const errorHandlerMiddleware = (err, req, res, next) => {
   let errorHandlerObj = {};
   switch (err.name) {
      //specific error
      case errorTypes.NOT_FOUND:
         errorHandlerObj.statusCode = StatusCodes.NOT_FOUND;
         errorHandlerObj.message = `${err.objInvolved} not found, ${err.message}`;
         break;

      //express-jwt error
      case errorTypes.UNAUTHORIZED_ERROR:
         errorHandlerObj.statusCode = err.status;
         errorHandlerObj.message = "Invalid or missing authentication token";
         break;

      //mongoose model validation error
      case errorTypes.VALIDATION_ERROR:
         errorHandlerObj.statusCode = StatusCodes.BAD_REQUEST;
         errorHandlerObj.message = Object.values(err.errors)
            .map((item) => item.message)
            .join(",");
         break;
      //express-jwt error
      case errorTypes.TOKEN_EXPIRED:
         errorHandlerObj.statusCode = StatusCodes.UNAUTHORIZED;
         errorHandlerObj.message =
            "Your session has expired, please login again";
         break;
      //express-jwt error
      case errorTypes.INVALID_SIGNATURE:
         errorHandlerObj.statusCode = StatusCodes.FORBIDDEN;
         errorHandlerObj.message =
            "A problem has occurred with authentication. Please try logging in again";
         break;
      case errorTypes.MONGO_SERVER_ERROR:
         switch (err.code) {
            case 11000:
               errorHandlerObj.statusCode = StatusCodes.CONFLICT;
               errorHandlerObj.message = `${Object.values(err.keyValue).join(
                  ", "
               )} is already registered`;
               break;
            default:
               errorHandlerObj.statusCode = INTERNAL_SERVER_ERROR;
               errorHandlerObj.message =
                  err.errmsg ||
                  "We are having problems at the moment please try again later";
               console.log(err);
               break;
         }
         break;
      default:
         errorHandlerObj.statusCode =
            err.status || StatusCodes.INTERNAL_SERVER_ERROR;
         errorHandlerObj.message =
            err.message ||
            "We are having problems at the moment please try again later";
         console.log(err);
         break;
   }
   res.status(errorHandlerObj.statusCode).json({
      message: errorHandlerObj.message,
   });
};

module.exports = errorHandlerMiddleware;
