import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { post } from "../api/axiosMethods";
import Loader from "../components/Loader";
import ErrorAlert from "../components/ErrorAlert";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const email = state?.email;
  const role = state?.role;

  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);

  if (!email || !role) navigate("/forgot-password");

  const handleReset = async () => {
    if (!newPassword.trim()) {
      setErrorMsg("Password is required");
      setShowError(true);
      return;
    }

    try {
      setShowLoader(true);
      await post("auth/reset-password", { email, role, newPassword });
      navigate("/");
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Reset failed");
      setShowError(true);
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold text-center">Reset Password</h2>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded pr-10"
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
          onClick={handleReset}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Update Password
        </button>
      </div>

      {showLoader && <Loader />}
      {showError && (
        <ErrorAlert autoClose message={errorMsg} onClose={() => setShowError(false)} />
      )}
    </div>
  );
}
