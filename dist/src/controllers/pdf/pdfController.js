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
const pdf_model_1 = __importDefault(require("../../db/models/pdf.model"));
const sharedFile_model_1 = __importDefault(require("../../db/models/sharedFile.model"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AddNewPdf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = JSON.parse(JSON.stringify(req.user));
        if (!req.file) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json({
                message: "Please upload a file",
            });
        }
        const base_url = process.env.BASE_URL;
        const file_url = base_url + "/public/pdf/" + req.file.filename;
        const newFile = new pdf_model_1.default({
            owner: user._id,
            docname: req.body.docname,
            filename: req.file.filename,
            file_url: file_url,
            filetype: req.file.mimetype,
            filesize: req.file.size,
        });
        yield newFile.save();
        res.status(200).json({
            type: "success",
            status: 200,
            message: "File Uploaded successfully",
            data: newFile,
        });
    }
    catch (error) {
        return res.status(404).json({
            type: "error",
            status: 404,
            message: error.message,
        });
    }
});
const UpdatePdfFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({
                type: "error",
                status: 400,
                message: "Please upload a file First",
            });
        }
        const user = JSON.parse(JSON.stringify(req.user));
        const { fileId } = req.body;
        const base_url = process.env.BASE_URL;
        const file_url = base_url + "/public/pdf/" + req.file.filename;
        const fileData = yield pdf_model_1.default.findOne({
            _id: fileId,
            owner: user._id,
            isdeleted: false,
        }).populate("owner");
        // const file = JSON.parse(JSON.stringify(fileData));
        if (!fileData) {
            return res.status(400).json({
                type: "error",
                status: 400,
                message: "File not found",
            });
        }
        // if (fileData.is_editable !== true) {
        //   return res.status(400).json({
        //     type: "error",
        //     status: 400,
        //     message: `${file.owner.fullname} is already edit this pdf if you want to edit now please contact with ${file.owner.fullname}`,
        //     editable: fileData.is_editable,
        //   });
        // }
        const requestData = {
            file_url: file_url,
            docname: req.body.docname,
            // filename: req.file.filename,
            // filetype: req.file.mimetype,
            filesize: req.file.size,
            // is_editable: false,
            isupdated: true,
            updated_at: Date.now(),
        };
        yield pdf_model_1.default.findByIdAndUpdate({
            _id: fileId,
        }, requestData);
        const updatedData = yield pdf_model_1.default.findOne({
            _id: fileId,
            owner: user._id,
            isdeleted: false,
        });
        res.status(200).json({
            type: "success",
            status: 200,
            message: "File Uploaded successfully",
            data: updatedData,
        });
    }
    catch (error) {
        return res.status(404).json({
            type: "error",
            status: 404,
            message: error.message,
        });
    }
});
const DeletePdfFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.fileId;
        const user = JSON.parse(JSON.stringify(req.user));
        const fileData = yield pdf_model_1.default.findOne({
            _id: id,
            isdeleted: false,
        }).populate("owner");
        const file = JSON.parse(JSON.stringify(fileData));
        if (file.owner._id !== user._id) {
            return res.status(400).json({
                type: "error",
                status: 400,
                message: `you don’t have permission to delete this file. Please contact ${file.owner.fullname} for permission`,
            });
        }
        if (!fileData) {
            return res.status(400).json({
                type: "error",
                status: 400,
                message: "File not found",
            });
        }
        const requestData = {
            isdeleted: true,
            deleted_at: Date.now(),
        };
        yield pdf_model_1.default.findByIdAndUpdate({
            _id: id,
        }, requestData);
        yield sharedFile_model_1.default.findOneAndUpdate({
            fileId: id,
        }, requestData);
        res.status(200).json({
            type: "success",
            status: 200,
            message: "File Deleted successfully",
            data: "",
        });
    }
    catch (error) {
        return res.status(404).json({
            type: "error",
            status: 404,
            message: error.message,
        });
    }
});
const ListPdfFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = JSON.parse(JSON.stringify(req.user));
        let { page, limit, sort, cond } = req.body;
        if (user) {
            cond = Object.assign({ owner: user._id, isdeleted: false }, cond);
        }
        if (!page || page < 1) {
            page = 1;
        }
        if (!limit) {
            limit = 10;
        }
        if (!cond) {
            cond = {};
        }
        if (!sort) {
            sort = { createdAt: -1 };
        }
        limit = parseInt(limit);
        const result = yield pdf_model_1.default.find(cond)
            .populate("owner")
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);
        const result_count = yield pdf_model_1.default.find(cond).count();
        const totalPages = Math.ceil(result_count / limit);
        return res.status(200).json({
            status: 200,
            type: "success",
            message: "Files Fetch Successfully",
            page: page,
            limit: limit,
            totalPages: totalPages,
            total: result_count,
            data: result,
        });
    }
    catch (error) {
        return res.status(404).json({
            type: "error",
            status: 404,
            message: error.message,
        });
    }
});
const GetPdfFileById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fileId } = req.params;
        const user = JSON.parse(JSON.stringify(req.user));
        const result = yield pdf_model_1.default.find({
            _id: fileId,
            owner: user._id,
            isdeleted: false,
        }).populate("owner");
        return res.status(200).json({
            status: 200,
            type: "success",
            message: "File Fetched Successfully",
            data: result,
        });
    }
    catch (error) {
        return res.status(404).json({
            type: "error",
            status: 404,
            message: error.message,
        });
    }
});
const CheckPdfFileIsEditable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fileId } = req.params;
        const result = yield pdf_model_1.default.findById({
            _id: fileId,
        }).populate("owner");
        const file = JSON.parse(JSON.stringify(result));
        if (result.is_editable !== true) {
            return res.status(400).json({
                status: 400,
                type: "error",
                message: `${file.owner.fullname} is already edit this pdf if you want to edit now please contact with ${file.owner.fullname}`,
                editable: result.is_editable,
                // data: result,
            });
        }
        return res.status(200).json({
            status: 200,
            type: "success",
            message: "File is Editable",
            editable: result.is_editable,
            // data: result,
        });
    }
    catch (error) {
        return res.status(404).json({
            type: "error",
            status: 404,
            message: error.message,
        });
    }
});
exports.default = {
    AddNewPdf,
    UpdatePdfFile,
    DeletePdfFile,
    ListPdfFiles,
    GetPdfFileById,
    CheckPdfFileIsEditable,
};
//# sourceMappingURL=pdfController.js.map