import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import otpGenerator from "otp-generator"
import { asyncHandler } from "../Utils/asyncHandler.js"
import apiResponse from "../Utils/apiResponse.js"
import apiError from "../Utils/errorHandler.js"
import User from "../Models/user.model.js"

const forgetPassword = asyncHandler(async (req, res) => {
    const { email, role } = req.body;

    if (!email || !role) {
        throw new apiError(400, "Email and Role is required");
    }

    const user = await User.findOne({ email, role });

    if (!user) {
        throw new apiError(404, "User not found");
    }

    const otp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        specialChars: false,
        upperCaseAlphabets: false
    })

    const hashOTP = await bcrypt.hash(otp, 10);
    user.resetPasswordOTP = hashOTP;
    user.resetPasswordOTPExpiry = Date.now() + 10 * 60 * 1000; // 10 mins

    await user.save();

    const transporter = await nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    await transporter.sendMail({
        from: "VMS Support <no-reply@vms.com>",
        to: email,
        subject: "Password Reset OTP",
        html: `<h3>Your OTP: ${otp}</h3><p>Valid for 10 minutes</p>`,
    })

    return res.status(200).json(
        new apiResponse(200, {}, "OTP sent to registered email")
    );
})

const verifyOTP = asyncHandler(async (req, res) => {
    const { email, role, otp } = req.body;

    if (!email || !otp || !role) {
        throw new apiError(400, "Email, Role and OTP is required");
    }

    const user = await User.findOne({ email, role });
    if (!user) {
        throw new apiError(404, "User not found");
    }

    const isValid = await bcrypt.compare(otp, user.resetPasswordOTP);
    if (!isValid) {
        throw new apiError(400, "Invalid OTP");
    }

    return res.status(200)
        .json(
            new apiResponse(
                200,
                {},
                "OTP Verified Successfully"
            )
        )
})

const resetPassword = asyncHandler(async (req, res) => {
    const { email, role, newPassword } = req.body;

    if (!email || !newPassword || !role) {
        throw new apiError(400, "Email, Role and New Password is required");
    }

    const user = await User.findOne({ email, role });
    if (!user) {
        throw new apiError(404, "User not found");
    }

    user.password = newPassword; // pre-save hook will hash
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpiry = undefined;

    await user.save();

    return res.status(200).json(
        new apiResponse(200, {}, "Password updated successfully")
    );
});


export {
    forgetPassword,
    verifyOTP,
    resetPassword
}