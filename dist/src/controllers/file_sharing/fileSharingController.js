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
const ShareFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestedData = req.body;
        const user = JSON.parse(JSON.stringify(req.user));
        if (requestedData.fileId) {
            if (requestedData.userId) {
                const fileData = yield pdf_model_1.default.findOne({
                    _id: requestedData.fileId,
                    isdeleted: false,
                }).populate("owner");
                const file = JSON.parse(JSON.stringify(fileData));
                if (file.owner._id !== user._id) {
                    return res.status(400).json({
                        type: "error",
                        status: 400,
                        message: `you don’t have permission to share this file. Please contact ${file.owner.fullname} for permission`,
                    });
                }
                const newSharedFile = new sharedFile_model_1.default({
                    senderId: user._id,
                    receiverId: requestedData.userId,
                    fileId: requestedData.fileId,
                });
                yield newSharedFile.save();
                res.status(200).json({
                    type: "success",
                    status: 200,
                    message: "File Send successfully",
                    data: newSharedFile,
                });
            }
            else {
                res.status(400).json({
                    type: "success",
                    status: 400,
                    message: "File receiver is required",
                    data: "",
                });
            }
        }
        else {
            res.status(400).json({
                type: "success",
                status: 400,
                message: "File is required",
                data: "",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            type: "error",
            status: 404,
            message: error.message,
        });
    }
});
const GrandAccess = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = JSON.parse(JSON.stringify(req.user));
        const id = req.params.id;
        const fileData = yield sharedFile_model_1.default.findOne({
            _id: id,
            isdeleted: false,
        }).populate("senderId");
        const file = JSON.parse(JSON.stringify(fileData));
        if (file.senderId._id !== user._id) {
            return res.status(400).json({
                type: "error",
                status: 400,
                message: `you don’t have permission to change grand access to this file. Please contact ${file.senderId.fullname} for permission`,
            });
        }
        const requestData = {
            access: true,
            IsSigned: true,
            updated_at: Date.now(),
        };
        yield sharedFile_model_1.default.findByIdAndUpdate({
            _id: id,
        }, requestData);
        const updatedData = yield sharedFile_model_1.default.findOne({
            _id: id,
            isdeleted: false,
        });
        res.status(200).json({
            type: "success",
            status: 200,
            message: "File access changes to grand successfully",
            data: updatedData.access,
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
const RevokeAccess = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = JSON.parse(JSON.stringify(req.user));
        const id = req.params.id;
        const fileData = yield sharedFile_model_1.default.findOne({
            _id: id,
            isdeleted: false,
        }).populate("senderId");
        const file = JSON.parse(JSON.stringify(fileData));
        if (file.senderId._id !== user._id) {
            return res.status(400).json({
                type: "error",
                status: 400,
                message: `you don’t have permission to change revoke access to this file. Please contact ${file.senderId.fullname} for permission`,
            });
        }
        const requestData = {
            access: false,
            IsSigned: false,
            updated_at: Date.now(),
        };
        yield sharedFile_model_1.default.findByIdAndUpdate({
            _id: id,
        }, requestData);
        const updatedData = yield sharedFile_model_1.default.findOne({
            _id: id,
            isdeleted: false,
        });
        res.status(200).json({
            type: "success",
            status: 200,
            message: "File access changes to revoke successfully",
            data: updatedData.access,
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
const DeleteSharedFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = JSON.parse(JSON.stringify(req.user));
        const id = req.params.id;
        const fileData = yield sharedFile_model_1.default.findOne({
            _id: id,
            isdeleted: false,
        }).populate("senderId");
        const file = JSON.parse(JSON.stringify(fileData));
        if (file.senderId._id !== user._id) {
            return res.status(400).json({
                type: "error",
                status: 400,
                message: `you don’t have permission to delete this file. Please contact ${file.senderId.fullname} for permission`,
            });
        }
        const requestData = {
            isdeleted: true,
            deleted_at: Date.now(),
        };
        yield sharedFile_model_1.default.findByIdAndUpdate({
            _id: id,
        }, requestData);
        res.status(200).json({
            type: "success",
            status: 200,
            message: "Shared File deleted successfully",
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
const ListSenderFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = JSON.parse(JSON.stringify(req.user));
        let { page, limit, sort, cond } = req.body;
        if (user) {
            cond = Object.assign({ senderId: user._id, access: true, isdeleted: false }, cond);
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
        const result = yield sharedFile_model_1.default.find(cond)
            .populate("senderId")
            .populate("receiverId")
            .populate("fileId")
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);
        const result_count = yield sharedFile_model_1.default.find(cond).count();
        const totalPages = Math.ceil(result_count / limit);
        res.status(200).json({
            type: "success",
            status: 200,
            message: "Shared File list fetched successfully",
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
const ListReceivedFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = JSON.parse(JSON.stringify(req.user));
        let { page, limit, sort, cond } = req.body;
        if (user) {
            cond = Object.assign({ receiverId: user._id, access: true, isdeleted: false }, cond);
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
        const result = yield sharedFile_model_1.default.find(cond)
            .populate("senderId")
            .populate("receiverId")
            .populate("fileId")
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);
        const result_count = yield sharedFile_model_1.default.find(cond).count();
        const totalPages = Math.ceil(result_count / limit);
        res.status(200).json({
            type: "success",
            status: 200,
            message: "Received File list fetched successfully",
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
const ReceivedFileById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = JSON.parse(JSON.stringify(req.user));
        const id = req.params.id;
        const result = yield sharedFile_model_1.default.find({
            _id: id,
            receiverId: user._id,
            access: true,
            isdeleted: false,
        })
            .populate("senderId")
            .populate("receiverId")
            .populate("fileId");
        res.status(200).json({
            type: "success",
            status: 200,
            message: "Received File details fetched successfully",
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
const SendFileById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = JSON.parse(JSON.stringify(req.user));
        const id = req.params.id;
        const result = yield sharedFile_model_1.default.find({
            _id: id,
            senderId: user._id,
            access: true,
            isdeleted: false,
        })
            .populate("senderId")
            .populate("receiverId")
            .populate("fileId");
        res.status(200).json({
            type: "success",
            status: 200,
            message: "Send File details fetched successfully",
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
const getByFileId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = JSON.parse(JSON.stringify(req.user));
        let { page, limit, sort, cond } = req.body;
        const file = req.body.file;
        if (user) {
            cond = Object.assign({ fileId: file, access: true, isdeleted: false }, cond);
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
        const result = yield sharedFile_model_1.default.find(cond)
            .populate("senderId")
            .populate("receiverId")
            .populate("fileId")
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);
        const result_count = yield sharedFile_model_1.default.find(cond).count();
        const totalPages = Math.ceil(result_count / limit);
        res.status(200).json({
            type: "success",
            status: 200,
            message: "File list fetched successfully",
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
exports.default = {
    ShareFile,
    GrandAccess,
    RevokeAccess,
    DeleteSharedFile,
    ListSenderFile,
    ListReceivedFile,
    SendFileById,
    ReceivedFileById,
    getByFileId,
};
//# sourceMappingURL=fileSharingController.js.map