import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const mongodbURI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(mongodbURI);
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
}

export default connectDB