import express from "express";
import userRoutes from "./userRoute";
import pdfFilesRoute from "./pdfFilesRoute";

const Router = express.Router();

Router.use("/user", userRoutes);
Router.use("/file", pdfFilesRoute);

export default Router;
