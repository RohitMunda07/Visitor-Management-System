import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { post } from "../api/axiosMethods";
import Loader from "../components/Loader";
import ErrorAlert from "../components/ErrorAlert";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const email = state?.email;
  const role = state?.role;

  const [otp, setOtp] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);

  if (!email || !role) navigate("/forgot-password");

  const handleVerify = async () => {
    if (!otp.trim()) {
      setErrorMsg("OTP is required");
      setShowError(true);
      return;
    }

    try {
      setShowLoader(true);
      await post("auth/verify-otp", { email, role, otp });
      navigate("/reset-password", { state: { email, role } });
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Invalid OTP");
      setShowError(true);
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold text-center">Verify OTP</h2>

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border px-4 py-2 rounded text-center tracking-widest"
        />

        <button
          onClick={handleVerify}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Verify OTP
        </button>
      </div>

      {showLoader && <Loader />}
      {showError && (
        <ErrorAlert autoClose message={errorMsg} onClose={() => setShowError(false)} />
      )}
    </div>
  );
}
