"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
function userRole(role) {
    return (req, res, next) => {
        if (req.user.role_id !== role) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                message: "Unauthorized",
            });
        }
        next();
    };
}
exports.default = userRole;
//# sourceMappingURL=userRole.middleware.js.map