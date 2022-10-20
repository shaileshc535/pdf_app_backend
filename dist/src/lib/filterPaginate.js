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
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterPaginate = void 0;
function filterPaginate(Model, filter = {}, { page = 1, limit = 10, sort = "createdAt", }) {
    return __awaiter(this, void 0, void 0, function* () {
        const docs = yield Model.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort(typeof sort === "string" ? sort : sort.join(" "));
        const total = yield Model.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);
        return { docs, total, totalPages, page: +page, limit: +limit, sort };
    });
}
exports.filterPaginate = filterPaginate;
//# sourceMappingURL=filterPaginate.js.map