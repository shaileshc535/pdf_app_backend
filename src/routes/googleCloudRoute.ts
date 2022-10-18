import express from "express";
import controller from "../controllers/pdf/GoogleCloud";
import Multer from "multer";
// import auth from "../middlewares/auth.middleware";

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const router = express.Router();

router.post("/save-file", controller.SaveImage);
router.get("/get-file", controller.GetImages);

export default router;
