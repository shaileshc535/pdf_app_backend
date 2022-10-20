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
exports.saveFile = void 0;
const fs_extra_1 = require("fs-extra");
const path_1 = __importDefault(require("path"));
function saveFile(user, req) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.file)
            return;
        const userDir = path_1.default.resolve(`./public/uploads/${user._id}`);
        //ensure dir exists
        yield (0, fs_extra_1.ensureDirSync)(userDir);
        // move the file to the folder
        const filePath = path_1.default.join(userDir, req.file.filename);
        yield (0, fs_extra_1.move)(req.file.path, filePath);
    });
}
exports.saveFile = saveFile;
//# sourceMappingURL=saveFile.js.map