"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const constant_1 = require("../../constant");
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const uploadFile = (request) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileName = request.file.fieldname;
        const datetimestamp = Date.now();
        const file_new_name = request.file.fieldname +
            "-" +
            datetimestamp +
            "." +
            request.file.originalname.split(".")[request.file.originalname.split(".").length - 1];
        const fileContent = Buffer.from(request.file.buffer, "binary");
        const params = {
            Bucket: constant_1.Bucket_URI + request.db_response._id + "/image",
            Key: file_new_name,
            Body: fileContent,
        };
        const s3_response = s3.upload(params);
        if (!s3_response)
            throw s3_response;
        return yield s3_response.promise();
    }
    catch (error) {
        return error;
    }
});
const deleteFile = (request) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = request.profile_image
            ? request.profile_image
            : request.profile_photo;
        const fileName = file.substring(file.lastIndexOf("/") + 1);
        const params = {
            Bucket: constant_1.Bucket_URI + request._id + "/image",
            Key: fileName,
        };
        const s3_response = s3.deleteObject(params);
        if (!s3_response)
            throw s3_response;
        return yield s3_response.promise();
    }
    catch (error) {
        return error;
    }
});
exports.default = { uploadFile, deleteFile };
//# sourceMappingURL=upload.js.map