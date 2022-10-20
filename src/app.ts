import express from "express";
import cors from "cors";
import path from "path";
import methodOverride from "method-override";
import { config } from "dotenv";
import getConnection from "./db/connection";
import Router from "./routes/index";
// import { initializeApp } from "firebase/app";

// const firebaseConfig = {
//   apiKey: "AIzaSyD0ctnphM4KCvV-aR-4UM98Ri5OY_9eWIk",
//   authDomain: "files-app-365911.firebaseapp.com",
//   projectId: "files-app-365911",
//   storageBucket: "files-app-365911.appspot.com",
//   messagingSenderId: "617005471972",
//   appId: "1:617005471972:web:0bf6eb9993d93f112574f1",
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

config();

const app = express();

// app.initializeApp(firebaseConfig);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(methodOverride("X-HTTP-Method-Override"));

//DATABASE CONNECTION
app.use(getConnection);
app.use("/public", express.static("./public"));
//View Engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

//ROUTES

app.use("/", Router);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  return console.log(`Server is listening at http://localhost:${PORT}`);
});

// "build": "tsc && copy -R src dist/src",
    // "build": "rimraf ./dist && tsc",
// 
