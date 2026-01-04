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

    console.log("Generated OTP:", otp); // Debug log

    const hashOTP = await bcrypt.hash(otp, 10);
    user.resetPasswordOTP = hashOTP;
    user.resetPasswordOTPExpiry = Date.now() + 10 * 60 * 1000; // 10 mins

    await user.save();

    // Test email configuration
    console.log("Email User:", process.env.EMAIL_USER);
    console.log("Email Pass exists:", !!process.env.EMAIL_PASS);

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            // Add these options
            tls: {
                rejectUnauthorized: false
            }
        });

        // Verify transporter configuration
        await transporter.verify();
        console.log("Transporter verified successfully");

        const mailOptions = {
            from: `"VMS Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Password Reset OTP - Visitor Management System",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Password Reset Request</h2>
                    <p>Your OTP for password reset is:</p>
                    <h1 style="background-color: #f0f0f0; padding: 10px; text-align: center; letter-spacing: 5px;">
                        ${otp}
                    </h1>
                    <p><strong>Valid for 10 minutes</strong></p>
                    <p>If you did not request this, please ignore this email.</p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.messageId);

        return res.status(200).json(
            new apiResponse(200, {}, "OTP sent to registered email")
        );

    } catch (emailError) {
        console.error("Email sending error:", emailError);
        throw new apiError(500, `Failed to send email: ${emailError.message}`);
    }
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

    // Check if OTP expired
    if (Date.now() > user.resetPasswordOTPExpiry) {
        throw new apiError(400, "OTP has expired");
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