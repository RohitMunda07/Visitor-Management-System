import { User, LogOut, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { get } from "../api/axiosMethods";

export default function ProfileDropdown({ onAddUser, onLogout, onViewProfile }) {
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const res = await get("user/get-current-user");
      setCurrentUser(res.data.data);
    };
    fetchCurrentUser();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar */}
      <button onClick={() => setOpen(!open)}>
        <img
          src={currentUser?.profileImage?.imageURL}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover border cursor-pointer"
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white border rounded shadow-lg z-50">
          <div className="px-4 py-3 border-b">
            <p className="font-medium capitalize">{currentUser?.fullName}</p>
            <p className="text-xs text-gray-500">{currentUser?.role}</p>
          </div>

          <button
            onClick={onViewProfile}
            className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-100"
          >
            <User size={16} /> View Profile
          </button>

          {(currentUser?.role === "hod") && (
            <button
              onClick={onAddUser}
              className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-100"
            >
              <Plus size={16} /> Add User
            </button>
          )}

          <button
            onClick={onLogout}
            className="w-full px-4 py-2 flex items-center gap-2 text-red-600 hover:bg-red-50"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
