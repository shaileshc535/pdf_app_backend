import * as path from "path";
import * as fs from "fs";
import { GoogleDriveService } from "./googleDriveServices";
import { Storage } from "@google-cloud/storage";
import processFile from "../pdf/upload";
import { format } from "util";

const driveClientId = process.env.GOOGLE_DRIVE_CLIENT_ID || "";
const driveClientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET || "";
const driveRedirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI || "";
const driveRefreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN || "";

(async () => {
  const googleDriveService = new GoogleDriveService(
    driveClientId,
    driveClientSecret,
    driveRedirectUri,
    driveRefreshToken
  );

  const finalPath = path.resolve(
    __dirname,
    "../../../public/img/general-logo.png"
  );
  const folderName = "Picture";

  if (!fs.existsSync(finalPath)) {
    throw new Error("File not found!");
  }

  let folder = await googleDriveService
    .searchFolder(folderName)
    .catch((error) => {
      console.error(error);
      return null;
    });

  if (!folder) {
    folder = await googleDriveService.createFolder(folderName);
  }

  await googleDriveService
    .saveFile("SpaceX", finalPath, "image/jpg", folder.id)
    .catch((error) => {
      console.error(error);
    });

  console.info("File uploaded successfully!");

  // Delete the file on the server
  fs.unlinkSync(finalPath);
})();

const storage = new Storage({ keyFilename: "myKey.json" });
const bucket = storage.bucket("file-storing-app-bucket");

const GetImages = async (req, res) => {
  try {
    console.log(process.env.GOOGLE_DRIVE_CLIENT_ID);
    console.log(process.env.GOOGLE_DRIVE_CLIENT_SECRET);
    console.log(process.env.GOOGLE_DRIVE_REDIRECT_URI);
    console.log(process.env.GOOGLE_DRIVE_REFRESH_TOKEN);

    const [files] = await bucket.getFiles();
    res.send([files]);
    console.log("Success");
  } catch (error) {
    res.send("Error:" + error);
  }
};

const SaveImage = async (req, res) => {
  try {
    await processFile(req, res);

    if (!req.file) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    const blob = bucket.file(req.file.originalname);

    console.log("blob", blob);

    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    console.log("blobStream", blobStream);

    blobStream.on("error", (err) => {
      res.status(500).send({ message: err.message });
    });

    blobStream.on("finish", async (data) => {
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );

      try {
        await bucket.file(req.file.originalname).makePublic();
      } catch {
        return res.status(500).send({
          message: `Uploaded the file successfully: ${req.file.originalname}, but public access is denied!`,
          url: publicUrl,
        });
      }

      res.status(200).send({
        message: "Uploaded the file successfully: " + req.file.originalname,
        url: publicUrl,
      });
    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

export default {
  SaveImage,
  GetImages,
};
