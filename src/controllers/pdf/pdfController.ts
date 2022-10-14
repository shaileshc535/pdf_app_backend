import PdfSchema from "../../db/models/pdf.model";
import { Response, NextFunction } from "express";
import S3 from "../../services/upload";
import StatusCodes from "http-status-codes";

export interface IPdf {
  userId: string;
  filename: string;
  filetype?: string;
  filesize?: string;
  isdeleted: boolean;
}

const AddNewPdf = async (req, res: Response, next: NextFunction) => {
  try {
    const user = JSON.parse(JSON.stringify(req.user));

    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Please upload a file",
      });
    }

    // const upload_data = {
    //   db_response: user._id,
    //   file: req.file,
    // };

    // const image_uri = await S3.uploadFile(upload_data);

    // console.log("image_uri", image_uri);

    const newFile = new PdfSchema({
      userId: user._id,
      docname: req.body.docname,
      filename: req.file.filename,
      filetype: req.file.mimetype,
      filesize: req.file.size,
    });

    await newFile.save();

    res.status(StatusCodes.CREATED).json({
      type: "success",
      status: true,
      message: "File Uploaded successfully",
      data: newFile,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      type: "error",
      status: false,
      message: error.message,
    });
  }
};

const UpdatePdfFile = async (req, res: Response) => {
  try {
    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Please upload a file First",
      });
    }
    const user = JSON.parse(JSON.stringify(req.user));

    const { fileId } = req.body;

    const fileData = await PdfSchema.findOne({ _id: fileId, userId: user._id });

    if (!fileData) {
      return res.status(StatusCodes.NOT_FOUND).json({
        type: "error",
        status: false,
        message: "File not found",
      });
    }

    const requestData = {
      docname: req.body.docname,
      filename: req.file.filename,
      filetype: req.file.mimetype,
      filesize: req.file.size,
    };

    await PdfSchema.findByIdAndUpdate(
      {
        _id: fileId,
      },
      requestData
    );

    const updatedData = await PdfSchema.findOne({
      _id: fileId,
      userId: user._id,
      isdeleted: false,
    });

    res.status(StatusCodes.CREATED).json({
      type: "success",
      status: true,
      message: "File Uploaded successfully",
      data: updatedData,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      type: "error",
      status: false,
      message: error.message,
    });
  }
};

const DeletePdfFile = async (req, res: Response) => {
  try {
    const id = req.params.fileId;

    const fileData = await PdfSchema.findOne({ _id: id, isdeleted: false });

    if (!fileData) {
      return res.status(StatusCodes.NOT_FOUND).json({
        type: "error",
        status: false,
        message: "File not found",
      });
    }

    const requestData = {
      isdeleted: true,
    };

    await PdfSchema.findByIdAndUpdate(
      {
        _id: id,
      },
      requestData
    );

    res.status(StatusCodes.CREATED).json({
      type: "success",
      status: true,
      message: "File Deleted successfully",
      data: "",
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      type: "error",
      status: false,
      message: error.message,
    });
  }
};

const ListPdfFiles = async (req, res: Response) => {
  try {
    const user = JSON.parse(JSON.stringify(req.user));
    let { page, limit, sort, cond } = req.body;

    if (user) {
      cond = { userId: user._id, ...cond };
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

    const result = await PdfSchema.find(cond)
      .populate("userId")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const result_count = await PdfSchema.find(cond).count();
    const totalPages = Math.ceil(result_count / limit);

    return res.status(StatusCodes.CREATED).json({
      status: true,
      type: "success",
      message: "Files Fetch Successfully",
      page: page,
      limit: limit,
      totalPages: totalPages,
      total: result_count,
      data: result,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      type: "error",
      status: false,
      message: error.message,
    });
  }
};

const GetPdfFileById = async (req, res: Response) => {
  try {
    const { fileId } = req.params;
    const user = JSON.parse(JSON.stringify(req.user));

    const result = await PdfSchema.findById({
      _id: fileId,
      userId: user._id,
    }).populate("userId");

    return res.status(StatusCodes.CREATED).json({
      status: true,
      type: "success",
      message: "File Fetched Successfully",
      data: result,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      type: "error",
      status: false,
      message: error.message,
    });
  }
};

export default {
  AddNewPdf,
  UpdatePdfFile,
  DeletePdfFile,
  ListPdfFiles,
  GetPdfFileById,
};
