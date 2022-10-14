import { Schema, model, PopulatedDoc } from "mongoose";
import { IUser } from "./user";

export interface IPdf {
  userId: PopulatedDoc<IUser>;
  filename: string;
  filetype?: string;
  filesize?: string;
  docname?: string;
  isdeleted: boolean;
}

const pdfSchema = new Schema<IPdf>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    filename: { type: String, required: true },
    docname: { type: String },
    filetype: { type: String },
    filesize: { type: String },
    isdeleted: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

pdfSchema.virtual("uploader", {
  ref: "user",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

const PdfSchema = model("PdfSchema", pdfSchema);

export default PdfSchema;
