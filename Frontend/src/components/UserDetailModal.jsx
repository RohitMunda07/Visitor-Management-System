import { X } from "lucide-react";

export default function UserDetailModal({ user, onClose }) {
  if (!user) return null;

  const {
    fullName,
    email,
    role,
    phoneNumber,
    aadharDetail,
    department,
    designation,
    profileImage,
    createdAt,
  } = user;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-2 border-gray-300 rounded-lg p-8 w-full max-w-4xl relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-600 hover:text-red-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl mb-6 text-center text-gray-800 font-semibold">
          User Details
        </h2>

        {/* Grid with spacing */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-6">
          <div className="space-y-1">
            <label className="block text-gray-700">Full Name</label>
            <input
              value={fullName || "N/A"}
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-50"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-gray-700">Role</label>
            <input
              value={role || "N/A"}
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-50 capitalize"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-gray-700">Email</label>
            <input
              value={email || "N/A"}
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-50"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-gray-700">Phone Number</label>
            <input
              value={phoneNumber || "N/A"}
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-50"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-gray-700">Aadhar Number</label>
            <input
              value={aadharDetail || "N/A"}
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-50"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-gray-700">Department</label>
            <input
              value={department || "N/A"}
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-50"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-gray-700">Designation</label>
            <input
              value={designation || "N/A"}
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-50"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-gray-700">Account Created</label>
            <input
              value={createdAt ? new Date(createdAt).toLocaleString() : "N/A"}
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-50"
            />
          </div>

          {/* Profile Image – adjusted size like Visitor */}
          <div className="col-span-2 space-y-2">
            <label className="block text-gray-700">Profile Image</label>
            <div className="flex justify-center border border-gray-300 rounded bg-gray-50 py-3">
              {profileImage?.imageURL ? (
                <img
                  src={profileImage.imageURL}
                  alt="Profile"
                  className="h-40 w-auto object-contain rounded"
                />
              ) : (
                <span className="text-gray-400">No Image Available</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
