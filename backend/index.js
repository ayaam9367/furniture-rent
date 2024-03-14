import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from "cors"
import bodyParser from "body-parser"
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import userRouter from './routes/user.route.js';
import cookieParser from 'cookie-parser';

dotenv.config({
    path:'../.env'
});
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.listen(5001,() =>{
    console.log("server is running on port 5001 ");
}
);

app.use("/backend/auth", authRouter);
app.use("/backend/user", userRouter);
app.use("/backend/listing", listingRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  });


mongoose.connect(process.env.MONGO)
.then(() => {
    console.log("connected to database");
})
.catch((err) => {
    console.log(err);
})