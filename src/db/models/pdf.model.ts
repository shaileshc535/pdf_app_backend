import { Schema, model, PopulatedDoc } from "mongoose";
import { IUser } from "./user";

export interface IPdf {
  ownerId?: PopulatedDoc<IUser>;
  filename: string;
  filetype?: string;
  filesize?: string;
  docname?: string;
  isdeleted: boolean;
  is_editable: boolean;
  isupdated: boolean;
  deleted_at: Date;
  updated_at: Date;
}

const pdfSchema = new Schema<IPdf>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    filename: { type: String, required: true },
    docname: { type: String },
    filetype: { type: String },
    filesize: { type: String },
    is_editable: { type: Boolean, default: true },
    isupdated: { type: Boolean, default: false },
    isdeleted: { type: Boolean, default: false },
    deleted_at: { type: Date },
    updated_at: { type: Date },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

pdfSchema.virtual("uploader", {
  ref: "user",
  localField: "ownerId",
  foreignField: "_id",
  justOne: true,
});

const PdfSchema = model("PdfSchema", pdfSchema);

export default PdfSchema;
