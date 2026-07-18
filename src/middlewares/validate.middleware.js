const ApiError = require("../utils/ApiError");

const validate = (schema) => {
    return (req, res, next) => {

        const { error } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            throw new ApiError(
                400,
                "Validation failed",
                error.details.map((err) => err.message)
            );
        }

        next();
    };
};

module.exports = validate;