import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { errorMiddleware } from "../Middlewares/error.middleware.js";

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

app.use(express.static('Public'))

app.use(cookieParser());

app.use(errorMiddleware)

export default app;