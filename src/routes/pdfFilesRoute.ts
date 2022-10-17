import express from "express";
import controller from "../controllers/pdf/pdfController";
import auth from "../middlewares/auth.middleware";
import multer from "multer";
import { ensureDir } from "fs-extra";
import path from "path";

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

const storage = multer.diskStorage({
  //multers disk storage settings
  destination: async function (req, file, cb) {
    await ensureDir("./public/pdf/");
    cb(null, "./public/pdf/");
  },

  filename: function (req, file, cb) {
    const datetimestamp = Date.now();
    cb(
      null,
      file.fieldname +
        "-" +
        datetimestamp +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1]
    );
  },
});

const upload = multer({
  storage,
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname);
    // if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
    //   return callback(new Error("Only images are allowed"));
    // }
    callback(null, true);
  },
}).single("filename");

const router = express.Router();

router.post("/add-file", auth, upload, controller.AddNewPdf);
router.put("/update-file", auth, upload, controller.UpdatePdfFile);
router.put("/delete-file/:fileId", auth, controller.DeletePdfFile);
router.post("/list-files", auth, controller.ListPdfFiles);
router.get("/get-file/:fileId", auth, controller.GetPdfFileById);
router.get(
  "/file-editable-check/:fileId",
  auth,
  controller.CheckPdfFileIsEditable
);

export default router;
