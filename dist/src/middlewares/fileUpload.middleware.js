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
const http_status_codes_1 = require("http-status-codes");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = require("fs-extra");
const storage = multer_1.default.diskStorage({
    //multers disk storage settings
    destination: function (req, file, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, fs_extra_1.ensureDir)("./public/uploads/");
            cb(null, "./public/uploads/");
        });
    },
    filename: function (req, file, cb) {
        const datetimestamp = Date.now();
        cb(null, file.fieldname +
            "-" +
            datetimestamp +
            "." +
            file.originalname.split(".")[file.originalname.split(".").length - 1]);
    },
});
const upload = (0, multer_1.default)({
    storage,
    fileFilter: function (req, file, callback) {
        const ext = path_1.default.extname(file.originalname);
        // if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
        //   return callback(new Error("Only images are allowed"));
        // }
        callback(null, true);
    },
}).single("profile_image");
function uploadFile(req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: err.message,
            });
        }
        next();
    });
}
exports.default = uploadFile;
//# sourceMappingURL=fileUpload.middleware.js.map