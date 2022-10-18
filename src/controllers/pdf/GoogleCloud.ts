import { Storage } from "@google-cloud/storage";
import processFile from "./upload";
import { format } from "util";

// const projectId = "file-storing-app";
// const keyFilename = "myKey.json";

// const storage = new Storage({
//   projectId,
//   keyFilename,
// });

// const bucket = storage.bucket("file-storing-app-bucket");

const storage = new Storage({ keyFilename: "myKey.json" });
const bucket = storage.bucket("file-storing-app-bucket");

const GetImages = async (req, res) => {
  try {
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
