"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathParamIdSchema = exports.objectId = exports.paginationQuerySchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
exports.paginationQuerySchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).default(1),
    limit: joi_1.default.number().integer().min(1).default(10),
    sort: joi_1.default.alternatives()
        .try(joi_1.default.string(), joi_1.default.array().items(joi_1.default.string()))
        .default(["createdAt"]),
}).options({
    allowUnknown: true,
});
exports.objectId = joi_1.default.string().custom((value, helpers) => {
    if (mongoose_1.default.isValidObjectId(value)) {
        return value;
    }
    return helpers.message({ custom: "{{#label}} is not a valid objectId" });
});
exports.pathParamIdSchema = joi_1.default.object({
    id: exports.objectId.required(),
});
//# sourceMappingURL=util.js.map