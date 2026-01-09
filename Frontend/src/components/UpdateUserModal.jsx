import { X } from "lucide-react";
import { useState } from "react";
import { put } from "../api/axiosMethods";
import Loader from "./Loader";
import ErrorAlert from "./ErrorAlert";

export default function UpdateUserModal({ user, onClose, onSuccess }) {
  if (!user) return null;

  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    phoneNumber: user.phoneNumber || "",
    email: user.email || "",
    role: user.role || "",
    aadharDetail: user.aadharDetail || "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user.profileImage?.imageURL || "");

  const [showLoader, setShowLoader] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);
  const [loaderMsg, setLoaderMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    try {
      setShowLoader(true);
      setLoaderMsg("Updating User Details");
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (image) {
        data.append("profileImage", image);
      }

      await put(`user/update-user/${user._id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onSuccess();
      onClose();
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Failed to update user");
      setShowError(true);
    } finally {
      setShowLoader(false);
      setLoaderMsg("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-xl rounded-lg p-6 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-red-600"
        >
          <X />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">
          Update User Details
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="border px-3 py-2 rounded"
          />

          <input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className="border px-3 py-2 rounded"
          />

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border px-3 py-2 rounded"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
          >
            <option value="admin">Admin</option>
            <option value="security">Security</option>
            <option value="hod">HOD</option>
            <option value="employee">Employee</option>
          </select>

          <input
            name="aadharDetail"
            value={formData.aadharDetail}
            onChange={handleChange}
            placeholder="Aadhar Number"
            className="border px-3 py-2 rounded col-span-2"
          />
        </div>

        {/* Image */}
        <div className="mt-4 space-y-2">
          <label className="text-sm text-gray-600">Profile Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-28 h-28 object-cover rounded border mt-2"
            />
          )}
        </div>

        <button
          onClick={handleUpdate}
          className="w-full mt-5 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Update User
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
