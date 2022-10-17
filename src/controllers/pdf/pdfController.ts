import PdfSchema from "../../db/models/pdf.model";
import { Response, NextFunction } from "express";
import S3 from "../../services/upload";
import StatusCodes from "http-status-codes";

export interface IPdf {
  ownerId: string;
  filename: string;
  filetype?: string;
  filesize?: string;
  docname?: string;
  isdeleted: boolean;
  is_editable: boolean;
  isupdated: boolean;
  deleted_at?: Date;
  updated_at?: Date;
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
      ownerId: user._id,
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

    const fileData = await PdfSchema.findOne({
      _id: fileId,
      ownerId: user._id,
      isdeleted: false,
    }).populate("ownerId");

    if (!fileData) {
      return res.status(StatusCodes.NOT_FOUND).json({
        type: "error",
        status: false,
        message: "File not found",
      });
    }

    if (fileData.is_editable !== true) {
      return res.status(StatusCodes.NOT_FOUND).json({
        type: "error",
        status: false,
        message: `${fileData.ownerId.fullname} is already edit this pdf if you want to edit now please contact with ${fileData.ownerId.fullname}`,
        editable: fileData.is_editable,
      });
    }

    const requestData = {
      docname: req.body.docname,
      filename: req.file.filename,
      filetype: req.file.mimetype,
      filesize: req.file.size,
      is_editable: false,
      isupdated: true,
      updated_at: Date.now(),
    };

    await PdfSchema.findByIdAndUpdate(
      {
        _id: fileId,
      },
      requestData
    );

    const updatedData = await PdfSchema.findOne({
      _id: fileId,
      ownerId: user._id,
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

    const user = JSON.parse(JSON.stringify(req.user));

    const fileData = await PdfSchema.findOne({
      _id: id,
      isdeleted: false,
    }).populate("ownerId");

    const file = JSON.parse(JSON.stringify(fileData));

    if (file.ownerId._id !== user._id) {
      console.log("false");
      return res.status(400).json({
        type: "error",
        status: false,
        message: `you don’t have permission to delete this file. Please contact ${file.ownerId.fullname} for permission`,
      });
    }

    if (!fileData) {
      return res.status(StatusCodes.NOT_FOUND).json({
        type: "error",
        status: false,
        message: "File not found",
      });
    }

    const requestData = {
      isdeleted: true,
      deleted_at: Date.now(),
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
      cond = { ownerId: user._id, isdeleted: false, ...cond };
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
      .populate("ownerId")
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

    const result = await PdfSchema.find({
      _id: fileId,
      ownerId: user._id,
      isdeleted: false,
    }).populate("ownerId");

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

const CheckPdfFileIsEditable = async (req, res: Response) => {
  try {
    const { fileId } = req.params;

    const result = await PdfSchema.findById({
      _id: fileId,
    }).populate("ownerId");

    if (result.is_editable !== true) {
      return res.status(StatusCodes.CREATED).json({
        status: true,
        type: "success",
        message: `${result.ownerId.fullname} is already edit this pdf if you want to edit now please contact with ${result.ownerId.fullname}`,
        editable: result.is_editable,
        // data: result,
      });
    }
    return res.status(StatusCodes.CREATED).json({
      status: true,
      type: "success",
      message: "File is Editable",
      editable: result.is_editable,
      // data: result,
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
  CheckPdfFileIsEditable,
};
