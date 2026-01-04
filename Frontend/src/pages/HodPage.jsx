import { Search, Eye, Lock, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import ErrorAlert from "../components/ErrorAlert";
import { del, get } from "../api/axiosMethods";
import UserDetailModal from "../components/UserDetailModal";
import AddUserModal from "../components/AddUserModal";
import UpdateUserPasswordModal from "../components/UpdateUserPasswordModal";
import Pagination from "../components/Pagination";
import UpdateUserModal from "../components/UpdateUserModal";
import ProfileDropdown from "../components/ProfileDropdown";


export default function HodPage() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    const [showLoader, setShowLoader] = useState(false);
    const [loaderMsg, setLoaderMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [showError, setShowError] = useState(false);

    const [searchValue, setSearchValue] = useState("");
    const [searchData, setSearchData] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const [showUpdatePassword, setShowUpdatePassword] = useState(false);
    const [viewUser, setViewUser] = useState(null);
    const [showAddUser, setShowAddUser] = useState(false);
    const [passwordUser, setPasswordUser] = useState(null);

    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);
    const [editUser, setEditUser] = useState(null);

    // role filter (ONLY admin & security)
    const [roleFilter, setRoleFilter] = useState("admin");
    const [showRoleFilter, setShowRoleFilter] = useState(false);

    const filteredUsers = (searchData.length === 0 ? users : searchData).filter(
        (user) => user.role === roleFilter
    );

    /* ================= FETCH USERS ================= */
    const fetchAllAdminAndSecurity = async (role, pageNo = 1) => {
        try {
            setShowLoader(true);
            setLoaderMsg("Fetching Users");

            const response = await get("user/get-all-users", {
                params: {
                    role,
                    page: pageNo,
                    limit: 50,
                },
            });
            console.log(response.data.data);
            console.log(response.data.data.pagination);

            setUsers(response.data.data.users || []);
            setPagination(response.data.data.pagination);
            setPage(pageNo);

        } catch (error) {
            setErrorMsg(error?.response?.data?.message || "Error fetching users");
            setShowError(true);
        } finally {
            setShowLoader(false);
            setLoaderMsg("");
        }
    };

    /* ================= SEARCH ================= */
    const handleSearch = async () => {
        if (!searchValue.trim()) {
            setSearchData([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);

        const filtered = users.filter(
            (u) =>
                u.fullName.toLowerCase().includes(searchValue.toLowerCase()) ||
                u.role.toLowerCase().includes(searchValue.toLowerCase())
        );

        setSearchData(filtered);
    };

    /* ================= MULTI SELECT ================= */
    const handleSelectUser = (user) => {
        setSelectedUsers((prev) => {
            const exists = prev.find((u) => u._id === user._id);
            return exists
                ? prev.filter((u) => u._id !== user._id)
                : [...prev, { _id: user._id, publicId: user.profileImage?.publicId }];
        });
    };

    /* ================= MULTI DELETE ================= */
    const handleMultipleDelete = async () => {
        if (selectedUsers.length === 0) return;

        try {
            setShowLoader(true);
            setLoaderMsg("Deleting Selected Users");

            await del("user/delete-users", {
                data: { userArray: selectedUsers },
            });

            setSelectedUsers([]);
            fetchAllAdminAndSecurity(roleFilter);
        } catch (error) {
            setErrorMsg(error?.response?.data?.message || "Error deleting users");
            setShowError(true);
        } finally {
            setShowLoader(false);
            setLoaderMsg("");
        }
    };

    /* ================= LOGOUT ================= */
    const handleLogout = async () => {
        try {
            setShowLoader(true);
            setLoaderMsg("Logging Out");
            const response = await get("auth/logout");
            console.log(response.data.message);
            sessionStorage.clear();
            navigate("/");
        } catch (error) {
            setErrorMsg(error.message);
            setShowError(true);
        } finally {
            setLoaderMsg("");
            setShowLoader(false);
        }
    };

    /* ================= Page Change ================= */
    const handlePageChange = (pageNo) => {
        fetchAllAdminAndSecurity(roleFilter, pageNo);
    };


    /* ================= EFFECTS ================= */
    useEffect(() => {
        fetchAllAdminAndSecurity(roleFilter);
    }, []);

    useEffect(() => {
        const delay = setTimeout(() => handleSearch(), 200);
        return () => clearTimeout(delay);
    }, [searchValue]);

    return (
        <div className="space-y-8 px-10 py-8">
            {/* Header */}
            <div className="w-full">
                <div className="flex justify-between items-center gap-3">
                    <h1 className="text-3xl font-bold text-gray-800">HOD Panel</h1>
                    <ProfileDropdown
                        onAddUser={() => setShowAddUser(true)}
                        onLogout={handleLogout}
                        onViewProfile={() => setViewUser("self")}
                    />
                </div>
            </div>

            {/* Search + Filters */}
            <div className="border bg-white p-6 rounded shadow">
                <div className="flex gap-4 mb-4">
                    <div className="flex-1 relative">
                        <input
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Search by name"
                            className="w-full border px-4 py-2 rounded"
                        />
                        <Search className="absolute right-3 top-2.5 text-blue-500" size={20} />
                    </div>

                    {/* Role Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowRoleFilter((prev) => !prev)}
                            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded 
                         hover:bg-gray-100 text-sm shadow flex items-center gap-2 capitalize"
                        >
                            {roleFilter}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {showRoleFilter && (
                            <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded shadow z-20">
                                {["hod", "admin", "security"].map((role) => (
                                    <button
                                        key={role}
                                        onClick={() => {
                                            setRoleFilter(role);
                                            setShowRoleFilter(false);
                                            fetchAllAdminAndSecurity(role);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 capitalize"
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Delete Button (size fixed) */}
                    <button
                        onClick={handleMultipleDelete}
                        disabled={selectedUsers.length === 0}
                        className={`px-3 py-1.5 text-sm rounded border shadow
              ${selectedUsers.length === 0
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-red-50 text-red-600 hover:bg-red-100"
                            }`}
                    >
                        Delete Users
                    </button>
                </div>

                {/* User List */}
                <div className="space-y-3">
                    {isSearching && searchData.length === 0 ? (
                        <p className="text-center text-gray-500">No record found</p>
                    ) : (
                        filteredUsers.map((user, index) => (
                            <div
                                key={user._id}
                                className="border p-4 rounded flex justify-between items-center"
                            >
                                <div>
                                    <input
                                        type="checkbox"
                                        className="mr-3"
                                        checked={selectedUsers.some((u) => u._id === user._id)}
                                        onChange={() => handleSelectUser(user)}
                                    />
                                    <span className="font-medium capitalize">
                                        #{index + 1} {user.fullName} ({user.role})
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Update User */}
                                    <Pencil
                                        size={18}
                                        className="text-green-600 cursor-pointer hover:text-green-700"
                                        onClick={() => setEditUser(user)}
                                    />

                                    {/* View User */}
                                    <Eye
                                        className="text-blue-500 cursor-pointer"
                                        onClick={() => setViewUser(user)}
                                    />

                                    {/* Update Password */}
                                    <Lock
                                        className="text-indigo-600 cursor-pointer hover:text-indigo-700"
                                        onClick={() => setPasswordUser(user)}
                                    />
                                </div>
                            </div>
                        ))
                    )}
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
            {showUpdatePassword && (
                <UpdateUserPasswordModal onClose={() => setShowUpdatePassword(false)} />
            )}

            {viewUser && (
                <UserDetailModal
                    user={viewUser === "self" ? null : viewUser}
                    isCurrentUser={viewUser === "self"}
                    onClose={() => setViewUser(null)}
                />
            )}

            {showAddUser && (
                <AddUserModal
                    role={roleFilter}          // role comes from dropdown
                    onClose={() => setShowAddUser(false)}
                    onSuccess={() => fetchAllAdminAndSecurity(roleFilter)}
                />
            )}

            {passwordUser && (
                <UpdateUserPasswordModal
                    user={passwordUser}
                    onClose={() => setPasswordUser(null)}
                    onSuccess={() => { }}
                />
            )}

            <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
            />

            {editUser && (
                <UpdateUserModal
                    user={editUser}
                    onClose={() => setEditUser(null)}
                    onSuccess={() => fetchAllAdminAndSecurity(roleFilter)}
                />
            )}


        </div>
    );
}
