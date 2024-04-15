import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from "cors"
import bodyParser from "body-parser"
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import userRouter from './routes/user.route.js';
import cookieParser from 'cookie-parser';
import adminauthRouter from './routes/adminauth.route.js';
import adminuserRouter from './routes/adminuser.route.js';
import requestRouter from './routes/request.route.js';
import path from 'path'

dotenv.config({
    path:'../.env'
});

const __dirname = path.resolve();
console.log(__dirname);

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use("/backend/auth", authRouter);
app.use("/backend/user", userRouter);
app.use("/backend/listing", listingRouter);
app.use("/backend/adminauth", adminauthRouter);
app.use("/backend/adminuser", adminuserRouter);
app.use("/backend/request", requestRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

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
});

app.listen(5001,() =>{
    console.log("server is running on port 5001 ");
}
);

export default app;