import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_ORIGIN,
}));

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({
    extended: true,
    limit: "20kb"
}));

app.use(cookieParser());

export default app;