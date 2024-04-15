import Adminuser from "../models/adminuser.models.js";
import bcryptjs from "bcryptjs";
import {errorHandler} from '../utils/error.js';
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new Adminuser({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("Admin user created succesfully!");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
    const {email, password} = req.body;
    try {
    const validUser = await Adminuser.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found!"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    console.log(res.cookie());
    res.cookie("access_token", token, {httpOnly: false, maxAge: 12096000000, sameSite: 'none', secure: false}).status(200).json({rest, token});
      
    } catch (error) {
        next(error);
    }
};


export const signOut = async (req, res, next) => {
    try {
      // Extract the authorization token from the headers
      const authorizationHeader = req.headers.authorization;
      
      if (!authorizationHeader) {
        // Handle case where authorization header is missing
        return res.status(401).json({ message: "Authorization header missing" });
      }
  
      // Extract the token from the authorization header
      const token = authorizationHeader.split(' ')[1]; // Assuming format is "Bearer <token>"
  
      // Validate or use the token as needed
      // For example, you might want to decode and verify the token
      // using a library like jsonwebtoken
  
      // Clear the access_token cookie
      res.json({ message: "User has been signed out!" });
  
    } catch (error) {
      next(error);
    }
  };
