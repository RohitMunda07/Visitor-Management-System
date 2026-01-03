import { X, Upload } from "lucide-react";
import { useState } from "react";
import { post } from "../api/axiosMethods";
import Loader from "./Loader";
import ErrorAlert from "./ErrorAlert";

export default function AddUserModal({ onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        email: "",
        password: "",
        aadharDetail: "",
    });

    const [role, setRole] = useState("security");
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);

    const [image, setImage] = useState(null);

    const [showLoader, setShowLoader] = useState(false);
    const [loaderMsg, setShowLoaderMsg] = useState("");

    const [errorMsg, setErrorMsg] = useState("");
    const [showError, setShowError] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async () => {
        if (!image) {
            setErrorMsg("Profile image is required");
            setShowError(true);
            return;
        }

        try {
            setShowLoaderMsg("Adding User");
            setShowLoader(true);
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) =>
                data.append(key, value)
            );

            data.append("role", role);
            data.append("profileImage", image);

            await post("auth/register", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            onSuccess();
            onClose();
        } catch (error) {
            setErrorMsg(error?.response?.data?.message || "Failed to create user");
            setShowError(true);
        } finally {
            setShowLoaderMsg("");
            setShowLoader(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white border-2 border-gray-300 rounded-lg p-8 w-full max-w-3xl relative shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-red-600 hover:text-red-700"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl text-center font-semibold mb-6">
                    Add New User
                </h2>

                {/* FORM GRID */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-1">
                        <label>Full Name</label>
                        <input
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <div className="space-y-1">
                        <label>Phone Number</label>
                        <input
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <div className="space-y-1">
                        <label>Email</label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <div className="space-y-1">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <div className="space-y-1">
                        <label>Aadhar Number</label>
                        <input
                            name="aadharDetail"
                            value={formData.aadharDetail}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    {/* ROLE DROPDOWN (SMALL & SEPARATE) */}
                    <div className="space-y-1 relative">
                        <label>Role</label>
                        <button
                            onClick={() => setShowRoleDropdown((prev) => !prev)}
                            className="w-full px-3 py-2 border rounded bg-white text-left capitalize flex justify-between items-center"
                        >
                            {role}
                            <span>▾</span>
                        </button>

                        {showRoleDropdown && (
                            <div className="absolute mt-1 w-full bg-white border rounded shadow z-20">
                                {["hod","admin", "security"].map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => {
                                            setRole(r);
                                            setShowRoleDropdown(false);
                                        }}
                                        className="w-full text-left px-3 py-2 hover:bg-gray-100 capitalize"
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* IMAGE INPUT (FIXED UI) */}
                    <div className="col-span-2 space-y-1">
                        <label>Profile Image</label>

                        <label className="flex items-center gap-3 px-4 py-2 border border-dashed rounded cursor-pointer hover:bg-gray-50">
                            <Upload size={18} className="text-gray-500" />
                            <span className="text-sm text-gray-600">
                                {image ? image.name : "Select Image"}
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </label>
                    </div>
                </div>

                {/* SUBMIT */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleSubmit}
                        className="px-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Create User
                    </button>
                </div>
            </div>

            {showLoader && <Loader text={loaderMsg} />}
            {showError && (
                <ErrorAlert
                    autoClose
                    message={errorMsg}
                    onClose={() => setShowError(false)}
                />
            )}
        </div>
    );
}
