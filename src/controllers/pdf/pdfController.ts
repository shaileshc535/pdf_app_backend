import PdfSchema from "../../db/models/pdf.model";
import { Response } from "express";
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
  createdAt?: Date;
  updatedAt?: Date;
}

const AddNewPdf = async (req, res: Response) => {
  try {
    const user = JSON.parse(JSON.stringify(req.user));

    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Please upload a file",
      });
    }

    const newFile = new PdfSchema({
      ownerId: user._id,
      docname: req.body.docname,
      filename: req.file.filename,
      filetype: req.file.mimetype,
      filesize: req.file.size,
    });

    await newFile.save();

    res.status(200).json({
      type: "success",
      status: 200,
      message: "File Uploaded successfully",
      data: newFile,
    });
  } catch (error) {
    return res.status(404).json({
      type: "error",
      status: 404,
      message: error.message,
    });
  }
};

const UpdatePdfFile = async (req, res: Response) => {
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

    const fileData = await PdfSchema.findOne({
      _id: fileId,
      ownerId: user._id,
      isdeleted: false,
    }).populate("ownerId");

    const file = JSON.parse(JSON.stringify(fileData));

    if (!fileData) {
      return res.status(400).json({
        type: "error",
        status: 400,
        message: "File not found",
      });
    }

    if (fileData.is_editable !== true) {
      return res.status(400).json({
        type: "error",
        status: 400,
        message: `${file.ownerId.fullname} is already edit this pdf if you want to edit now please contact with ${file.ownerId.fullname}`,
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

    res.status(200).json({
      type: "success",
      status: 200,
      message: "File Uploaded successfully",
      data: updatedData,
    });
  } catch (error) {
    return res.status(404).json({
      type: "error",
      status: 404,
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
        status: 400,
        message: `you don’t have permission to delete this file. Please contact ${file.ownerId.fullname} for permission`,
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

    await PdfSchema.findByIdAndUpdate(
      {
        _id: id,
      },
      requestData
    );

    res.status(200).json({
      type: "success",
      status: 200,
      message: "File Deleted successfully",
      data: "",
    });
  } catch (error) {
    return res.status(404).json({
      type: "error",
      status: 404,
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

    const data = [];

    for (let i = 0; i < result.length; i++) {
      const base_url = process.env.BASE_URL;

      const file_url = base_url + "/public/pdf/" + result[i].filename;

      const owner = result[i].ownerId;
      const docname = result[i].docname;
      const filetype = result[i].filetype;
      const filesize = result[i].filesize;
      const is_editable = result[i].is_editable;
      const isupdated = result[i].isupdated;
      const isdeleted = result[i].isdeleted;
      const createdAt = result[i].createdAt;
      const updatedAt = result[i].updatedAt;
      const fileConsumers = result[i].fileConsumers;
      const __v = result[i].__v;

      data.push({
        file_url: file_url,
        owner,
        docname,
        filetype,
        filesize,
        is_editable,
        isupdated,
        isdeleted,
        fileConsumers,
        createdAt,
        updatedAt,
        __v,
      });
    }

    return res.status(200).json({
      status: 200,
      type: "success",
      message: "Files Fetch Successfully",
      page: page,
      limit: limit,
      totalPages: totalPages,
      total: result_count,
      data: data,
    });
  } catch (error) {
    return res.status(404).json({
      type: "error",
      status: 404,
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
    });

    const base_url = process.env.BASE_URL;

    const file_url = base_url + "/public/pdf/" + result.filename;

    result.push({ file_url: file_url });

    // console.log("result", result);
    // console.log("file_url", file_url);
    return res.status(200).json({
      status: 200,
      type: "success",
      message: "File Fetched Successfully",
      data: result,
      file_url: file_url,
    });
  } catch (error) {
    return res.status(404).json({
      type: "error",
      status: 404,
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

    const file = JSON.parse(JSON.stringify(result));

    if (result.is_editable !== true) {
      return res.status(400).json({
        status: 400,
        type: "error",
        message: `${file.ownerId.fullname} is already edit this pdf if you want to edit now please contact with ${file.ownerId.fullname}`,
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
  } catch (error) {
    return res.status(404).json({
      type: "error",
      status: 404,
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
