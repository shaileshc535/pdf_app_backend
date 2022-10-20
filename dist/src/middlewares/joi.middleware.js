"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.validateParams = exports.validateQuery = exports.validateBody = void 0;
const http_status_codes_1 = require("http-status-codes");
const validateBody = (schema) => {
    return (0, exports.validate)(schema, "body");
};
exports.validateBody = validateBody;
const validateQuery = (schema) => {
    return (0, exports.validate)(schema, "query");
};
exports.validateQuery = validateQuery;
const validateParams = (schema) => {
    return (0, exports.validate)(schema, "params");
};
exports.validateParams = validateParams;
const validate = (schema, key) => {
    return (req, res, next) => {
        try {
            const { error } = schema.validate(req[key]);
            const valid = error == null;
            if (valid) {
                next();
            }
            else {
                const { details } = error;
                const message = details.map((i) => i.message).join(",");
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    type: "error",
                    status: false,
                    message: message,
                });
            }
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                type: "error",
                status: false,
                message: error.message,
            });
        }
    };
};
exports.validate = validate;
//# sourceMappingURL=joi.middleware.js.map