import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import User from "../../db/models/user";
import bcrypt from "bcrypt";

const login = async (req, res) => {
  const { email, password } = req.body;
  const verifiedEmail = email.toLowerCase();
  try {
    User.findOne({
      email: verifiedEmail,
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({
          type: "error",
          status: false,
          message: err,
        });
        return;
      }
      if (!user) {
        return res.status(404).send({
          type: "error",
          status: false,
          message: "User Not Found",
        });
      }

      const passwordIsValid = bcrypt.compareSync(password, user.password);

      console.log("passwordIsValid", passwordIsValid);

      if (!passwordIsValid) {
        return res.status(404).send({
          type: "error",
          status: false,
          message: "Invalid Password!",
        });
      }

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 86400, //24 hours
      });

      res.status(StatusCodes.OK).json({
        type: "success",
        status: true,
        message: "User Successfully Logged-In",
        data: {
          ...user.toObject(),
          token: token,
        },
      });
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      type: "error",
      status: false,
      message: error.message,
    });
  }
};

export default login;
