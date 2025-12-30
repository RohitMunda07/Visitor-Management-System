import { useState } from "react";
import { post } from "../api/axiosMethods";
import Loader from "../components/Loader";
import ErrorAlert from "../components/ErrorAlert";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [showError, setShowError] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const navigate = useNavigate();

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.email || !formData.password || !formData.role) {
            setErrorMsg("Please fill all fields");
            setShowError(true);
            return;
        }

        try {
            setShowLoader(true);

            const response = await post("auth/login", formData);

            const role = response?.data?.data?.user?.role;

            if (!role) {
                throw new Error("Role not found");
            }

            if (role === "hod" || role === "admin") {
                navigate("/admin")
            } else {
                navigate("/security")
            }

        } catch (error) {
            setErrorMsg(
                error.response?.data?.message ||
                error.message ||
                "Login failed"
            );
            setShowError(true);

        } finally {
            setShowLoader(false); // ✅ single source of truth
        }
    };
    // Store token or user data if needed
    // localStorage.setItem("token", response.data.token);

    // Redirect based on role or handle success
    // navigate to appropriate dashboard
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                    Login
                </h2>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="user@meconlimited.co.in"
                            value={formData.email}
                            onChange={handleOnChange}
                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-800"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleOnChange}
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-800"
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePassword}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? "👁️" : "🔒"}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-2">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleOnChange}
                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-800"
                            required
                        >
                            <option value="">Select Role</option>
                            <option value="employee">Employee</option>
                            <option value="hod">HOD</option>
                            <option value="security">Security</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center text-gray-600">
                            <input type="checkbox" className="mr-2" />
                            Remember me
                        </label>
                        <a href="/forgot-password" className="text-blue-500 hover:text-blue-600">
                            Forgot password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                        Login
                    </button>

                    <div className="text-center text-sm text-gray-600 mt-4">
                        Don't have an account?{" "}
                        <a href="/register" className="text-blue-500 hover:text-blue-600">
                            Register
                        </a>
                    </div>
                </form>

                {/* Loader */}
                {showLoader && <Loader
                    text="Logging in..."
                    size="medium"
                    onClose={() => setShowLoader(false)}
                />}

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