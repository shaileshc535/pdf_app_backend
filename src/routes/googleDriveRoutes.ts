import express from "express";
import controller from "../controllers/pdf/GoogleDrive";
import Multer from "multer";
// import auth from "../middlewares/auth.middleware";

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const router = express.Router();

router.post("/save", controller.SaveImage);
router.get("/get", controller.GetImages);

export default router;
