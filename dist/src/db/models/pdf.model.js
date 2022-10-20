"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const pdfSchema = new mongoose_1.Schema({
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: "user", required: true },
    filename: { type: String, required: true },
    file_url: { type: String, required: true },
    docname: { type: String },
    filetype: { type: String },
    filesize: { type: String },
    is_editable: { type: Boolean, default: true },
    isupdated: { type: Boolean, default: false },
    isdeleted: { type: Boolean, default: false },
    deleted_at: { type: Date },
    updated_at: { type: Date },
    fileConsumers: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "user",
            default: null,
        },
    ],
}, { timestamps: true, toJSON: { virtuals: true } });
pdfSchema.virtual("uploader", {
    ref: "user",
    localField: "owner",
    foreignField: "_id",
    justOne: true,
});
const PdfSchema = (0, mongoose_1.model)("PdfSchema", pdfSchema);
exports.default = PdfSchema;
//# sourceMappingURL=pdf.model.js.map