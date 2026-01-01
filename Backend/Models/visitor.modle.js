import mongoose from "mongoose";
import { Schema } from "mongoose";

const visitorSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true
    },
    company: {
        type: String,
        trim: true,
        lowercase: true,
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
    phoneNumber: {
        type: String,
        required: true
    },
    visitorImage: {
        type: {
            imageURL: String,
            publicId: String
        }
    },
    aadharDetail: {
        type: String,
        required: true
    },
    personToVisiting: {
        type: String,
        trim: true,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    }
}
    , { timestamps: true }
)

const Visitor = mongoose.model('Visitor', visitorSchema)

export default Visitor;