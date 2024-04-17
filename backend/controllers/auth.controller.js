import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("User created successfully!");
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Set status code to 400 for validation errors
      return res.status(400).json({ message: 'Validation failed', error });
    }
    // Set status code to 500 for database errors
    //return res.status(500).json({ message: 'Internal Server Error', error });
    next(errorHandler(500, 'Internal Server Error'))
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found!"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res.cookie("access_token", token, {httpOnly: false, maxAge: 12096000000, sameSite: 'none', secure: false})
    res.status(200)
    res.json({rest, token});
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

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json({rest, token});
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json({rest, token});
    }
  } catch (error) {
    next(error);
  }
};
