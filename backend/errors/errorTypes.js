const ErrorTypes = Object.freeze({
   NOT_FOUND: "NotFoundError",
   UNAUTHORIZED_ERROR: "UnauthorizedError",
   VALIDATION_ERROR: "ValidationError",
   TOKEN_EXPIRED: "TokenExpiredError",
   INVALID_SIGNATURE: "JsonWebTokenError",
   MONGO_SERVER_ERROR: "MongoServerError",
   CAST_ERROR: "CastError",
});

module.exports = ErrorTypes;
