import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../api/axiosMethods";
import Loader from "../components/Loader";
import ErrorAlert from "../components/ErrorAlert";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !role) {
      setErrorMsg("Email and Role are required");
      setShowError(true);
      return;
    }

    try {
      setShowLoader(true);
      await post("auth/forgot-password", { email, role });
      navigate("/verify-otp", { state: { email, role } });
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Failed to send OTP");
      setShowError(true);
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold text-center">Forgot Password</h2>

        <input
          type="email"
          placeholder="Registered Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />

        {/* Role Dropdown */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border px-4 py-2 rounded bg-white"
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="hod">HOD</option>
          <option value="security">Security</option>
          <option value="employee">Employee</option>
        </select>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Send OTP
        </button>
      </div>

      {showLoader && <Loader />}
      {showError && (
        <ErrorAlert autoClose message={errorMsg} onClose={() => setShowError(false)} />
      )}
    </div>
  );
}
