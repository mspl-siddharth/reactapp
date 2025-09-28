import User from "../models/user.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "all fields are required" });
    }

    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.json({
        success: false,
        message: "email already exist",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashPassword,
    });

    await newUser.save();

    return res.json({ success: true, message: "register successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "email and password required",
      });
    }

    const userExist = await User.findOne({ email: email });

    if (!userExist) {
      return res.json({
        success: false,
        message: "user not found, please register",
      });
    }

    console.log(password, userExist.password);

    const checkPassword = await bcrypt.compare(password, userExist.password);

    if (!checkPassword) {
      return res.json({ success: false, message: "password wrong" });
    }

    const token = jwt.sign(
      { userId: userExist._id },
      process.env.TOKENSECRETKEY
    );

    return res.json({
      success: true,
      message: "login successful",
      userData: userExist,
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error });
  }
};

export const GetCurrentUser = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.json({ success: false });
    }

    const tokenData = jwt.verify(token, process.env.TOKENSECRETKEY);
    if (!tokenData) {
      return res.json({ success: false });
    }

    console.log(tokenData);

    const isUserExists = await User.findById(tokenData.userId);
    if (!isUserExists) {
      return res.json({ success: false });
    }

    return res.json({
      success: true,
      user: {
        userId: isUserExists._id,
        name: isUserExists.name,
        email: isUserExists.email,
      },
    });
  } catch (error) {
    console.log(error, "error in get-current-user api call ..");
    return res.json({ success: false, message: error });
  }
};
