"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = (email, subject, text = "", html = "") => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.zoho.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.ZOHO_MAIL,
                pass: process.env.ZOHO_PASS,
            },
        });
        // const transporter = nodemailer.createTransport({
        //     service:"hotmail",
        //     auth:{
        //         user: "telemdbackend@outlook.com",
        //         pass: "Developer@123"
        //     }
        // });
        const options = {
            from: process.env.ZOHO_MAIL,
            to: email,
            subject: subject,
            text: text,
            html,
        };
        transporter.sendMail(options, function (err, info) {
            if (err) {
                console.log(err);
                return;
            }
        });
        console.log("Eamil sent Successful");
    }
    catch (error) {
        console.log(error, "email not sent");
    }
});
exports.default = sendEmail;
//# sourceMappingURL=sendEmail.js.map