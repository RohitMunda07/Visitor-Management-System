import { X, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { put } from "../api/axiosMethods";
import Loader from "./Loader";
import ErrorAlert from "./ErrorAlert";

export default function UpdateUserPasswordModal({ user, onClose, onSuccess }) {
    if (!user) return null;

    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [showError, setShowError] = useState(false);
    const [loaderMsg, setLoaderMsg] = useState("");

    const handleUpdate = async () => {
        if (!newPassword.trim()) {
            setErrorMsg("Password is required");
            setShowError(true);
            return;
        }

        try {
            // ✅ reset previous error
            setErrorMsg("");
            setShowError(false);

            setShowLoader(true);
            setLoaderMsg("Updating Password");
            const response = await put("user/update-password", {
                userId: user._id,
                role: user.role,
                newPassword,
            });
            console.log(response.data.message);

            onSuccess?.();
            onClose();
        } catch (error) {
            setErrorMsg(
                error?.response?.data?.message || "Failed to update password"
            );
            setShowError(true);
        } finally {
            setShowLoader(false);
            setLoaderMsg("");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white border-2 border-gray-300 rounded-lg p-6 w-full max-w-md relative shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-red-600 hover:text-red-700"
                >
                    <X />
                </button>

                <h2 className="text-xl font-semibold mb-4 text-center">
                    Update Password
                </h2>

                <p className="text-sm text-gray-600 mb-3 text-center">
                    User: <span className="font-medium">{user.fullName}</span>
                </p>

                {/* PASSWORD INPUT */}
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full border px-4 py-2 pr-10 rounded"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-2.5 text-gray-500"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <button
                    onClick={handleUpdate}
                    disabled={showLoader}
                    className={`w-full mt-4 px-4 py-2 rounded text-white
                      ${showLoader
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    Update Password
                </button>
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
