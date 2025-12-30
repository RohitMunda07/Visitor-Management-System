import { useState } from "react";
import { post } from "../api/axiosMethods";
import Loader from "../components/Loader";
import ErrorAlert from "../components/ErrorAlert";
import { useEffect } from "react";

export default function Register() {
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        aadharDetail: "",
    });

    const [profileImage, setProfileImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [showError, setShowError] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        console.log(file);
        if (file && file.type.startsWith("image/")) {
            setProfileImage(file);
            setPreview(URL.createObjectURL(file));
        } else {
            setErrorMsg("Please select a valid image file");
            setShowError(true);
        }
    };

    // Format Aadhaar as user types
    const handleAadhaarChange = (e) => {
        const value = e.target.value;
        setFormData({ ...formData, aadharDetail: value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validation
        if (
            !formData.fullName ||
            !formData.phoneNumber ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword ||
            !formData.role ||
            !formData.aadharDetail ||
            !profileImage
        ) {
            setErrorMsg("Please fill all fields");
            setShowError(true);
            return;
        }

        // Phone validation
        if (formData.phoneNumber.length !== 10) {
            setErrorMsg("Phone number must be 10 digits");
            setShowError(true);
            return;
        }

        // Aadhaar validation
        if (formData.aadharDetail.length !== 12) {
            setErrorMsg("Aadhaar number must be 12 digits");
            setShowError(true);
            return;
        }

        // Password match validation
        if (formData.password !== formData.confirmPassword) {
            setErrorMsg("Passwords do not match");
            setShowError(true);
            return;
        }

        // Create FormData for file upload
        const data = new FormData();
        data.append("fullName", formData.fullName);
        data.append("phoneNumber", formData.phoneNumber);
        data.append("email", formData.email);
        data.append("password", formData.password);
        data.append("role", formData.role);
        data.append("aadharDetail", formData.aadharDetail);
        data.append("profileImage", profileImage);

        // Debug: Check FormData entries
        // console.log("=== FormData Debug ===");
        // for (let [key, value] of data.entries()) {
        //     if (value instanceof File) {
        //         console.log(`${key}:`, value.name, value.size, value.type);
        //     } else {
        //         console.log(`${key}:`, value);
        //     }
        // }

        try {
            setShowLoader(true);
            console.log("Register form data", data);
            const response = await post("auth/register", data, {
                "Content-Type": "multipart/form-data"
            });

            console.log("Registration successful:", response.data);

            // Reset form on success
            setFormData({
                fullName: "",
                phoneNumber: "",
                email: "",
                password: "",
                confirmPassword: "",
                role: "",
                aadharDetail: "",
            });
            setProfileImage(null);
            setPreview(null);

            // Show success message or redirect to login
            // alert("Registration successful! Please login.");
            // navigate("/login");

        } catch (error) {
            console.log("Registration error:", error);
            setErrorMsg(error.response?.data?.message || error.message || "Registration failed");
            setShowError(true);
        } finally {
            setShowLoader(false);
        }
    };

    useEffect(() => {
        console.log(formData);
    }, [formData])

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                {/* <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            Registration
          </h1>
        </div> */}

                {/* Registration Form */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <form onSubmit={handleRegister}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="md:col-span-2">
                                <label className="block mb-2 text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleOnChange}
                                    className="w-full bg-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-gray-800"
                                    required
                                />
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block mb-2 text-gray-700">Phone Number</label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleOnChange}
                                    placeholder="10-digit mobile number"
                                    maxLength="10"
                                    className="w-full bg-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-gray-800"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block mb-2 text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleOnChange}
                                    placeholder="user@meconlimited.co.in"
                                    className="w-full bg-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-gray-800"
                                    required
                                />
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block mb-2 text-gray-700">Role</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleOnChange}
                                    className="w-full bg-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-gray-800"
                                    required
                                >
                                    <option value="">Select Role</option>
                                    <option value="employee">Employee</option>
                                    <option value="hod">HOD</option>
                                    <option value="security">Security</option>
                                </select>
                            </div>

                            {/* Aadhaar Detail */}
                            <div>
                                <label className="block mb-2 text-gray-700">Aadhaar Number</label>
                                <input
                                    type="text"
                                    name="aadharDetail"
                                    value={formData.aadharDetail}
                                    onChange={handleAadhaarChange}
                                    placeholder="XXXX-XXXX-XXXX"
                                    maxLength="14"
                                    className="w-full bg-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-gray-800"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block mb-2 text-gray-700">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleOnChange}
                                    className="w-full bg-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-gray-800"
                                    required
                                />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block mb-2 text-gray-700">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleOnChange}
                                    className="w-full bg-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-gray-800"
                                    required
                                />
                            </div>

                            {/* Profile Image */}
                            <div className="md:col-span-2">
                                <label className="block mb-2 text-gray-700">Profile Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full bg-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-gray-800 file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                                    required
                                />
                                {preview && (
                                    <div className="mt-3 flex justify-center">
                                        <img
                                            className="w-48 h-48 object-cover rounded-lg border border-gray-300"
                                            src={preview}
                                            alt="Preview"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors font-medium"
                            >
                                Register
                            </button>
                        </div>

                        {/* Login Link */}
                        <div className="text-center text-sm text-gray-600 mt-4">
                            Already have an account?{" "}
                            <a href="/" className="text-blue-500 hover:text-blue-600">
                                Login
                            </a>
                        </div>
                    </form>
                </div>

                {/* Loader */}
                {showLoader && <Loader text="Registering..." size="medium" />}

                {/* Error Alert */}
                {showError && (
                    <ErrorAlert
                        autoClose={true}
                        message={errorMsg}
                        onClose={() => setShowError(false)}
                    />
                )}
            </div>
        </div>
    );
}