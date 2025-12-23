import { errorMiddleware } from "../Middlewares/error.middleware.js";
import visitorRoute from "../Routes/visitor.route.js";
import userRoute from "../Routes/user.route.js";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_ORIGIN,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({
    extended: true,
    limit: "20kb"
}));

app.use(express.static('Public'));

app.use(cookieParser());

// user route
app.use('/api/v1/user', userRoute);

// visitor route
app.use('/api/v1/visitor', visitorRoute);

app.use(errorMiddleware)

export default app;