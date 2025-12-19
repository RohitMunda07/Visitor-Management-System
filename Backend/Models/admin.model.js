import mongoose, { mongo } from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const adminSchema = new Schema({
    fullName: {
        type: String,
        trim: true,
        index: true,
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    profileImgae: {
        type: String
    },
    aadharDetail: {
        type: Number
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true })


// ============================================================
// Password related work
adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// compare password at login time
adminSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

// =================================================================
// generating access token and refresh token
adminSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            fullName,
            email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }

    )
}

adminSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const Admin = mongoose.model('Admin', adminSchema)
export default Admin