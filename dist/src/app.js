"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const method_override_1 = __importDefault(require("method-override"));
const dotenv_1 = require("dotenv");
const connection_1 = __importDefault(require("./db/connection"));
const index_1 = __importDefault(require("./routes/index"));
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
(0, dotenv_1.config)();
const app = (0, express_1.default)();
// app.initializeApp(firebaseConfig);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, method_override_1.default)("X-HTTP-Method-Override"));
//DATABASE CONNECTION
app.use(connection_1.default);
app.use("/public", express_1.default.static("./public"));
//View Engine
app.set("views", path_1.default.join(__dirname, "/views"));
app.set("view engine", "ejs");
//ROUTES
app.use("/", index_1.default);
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
//# sourceMappingURL=app.js.map