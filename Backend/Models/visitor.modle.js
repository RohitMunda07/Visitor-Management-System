import mongoose from "mongoose";
import { Schema } from "mongoose";

const visitorSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    company: {
        type: String,
        trim: true,
        required: true
    },
    work: {
        type: String,
        trim: true,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    contact: {
        type: Number,
        required: true
    },
    profileImgae: {
        type: String
    },
    aadharDetail: {
        type: Number
    },
    personToVisiting: {
        type: String,
        trim: true,
        required: true
    }
}
    , { timestamps: true }
)

const Visitor = mongoose.model('Visitor', visitorSchema)

export default Visitor;