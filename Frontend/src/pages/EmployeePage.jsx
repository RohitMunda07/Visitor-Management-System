import { useEffect, useState, useRef } from "react";
import { get, post } from "../api/axiosMethods";
import Loader from "../components/Loader";
import ErrorAlert from "../components/ErrorAlert";
import { Eye, Search } from "lucide-react";
import ProfileDropdown from "../components/ProfileDropdown";
import UserDetailModal from "../components/UserDetailModal";
import Pagination from "../components/Pagination";
import SortFilter from "../components/SortFilter";
import { SORT_TYPE } from "../constants/sortType";
import VisitorDetailModal from "../components/VisitorDetailModal";
import { useDispatch, useSelector } from "react-redux";
import { addVisitorDetails } from "../context/visitorDetailSlice";
import { useNavigate } from "react-router-dom";


export default function EmployeePage() {
  /* ================= STATES ================= */
  const [visitorData, setVisitorData] = useState({
    name: "",
    person: "",
    contact: "",
    company: "",
    work: "",
    aadharDetails: "",
  });

  const [visitorImage, setVisitorImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [visitors, setVisitors] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchData, setSearchData] = useState([]);

  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortType, setSortType] = useState(SORT_TYPE.NEWEST);

  const [viewUser, setViewUser] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [loaderMsg, setLoaderMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const toggleValue = useSelector((state) => state.visitorDetail.value);

  const mapData = searchData.length ? searchData : visitors;

  /* ================= FETCH VISITORS ================= */
  const fetchVisitors = async (pageNo = 1) => {
    try {
      setShowLoader(true);
      const res = await get("visitor/get-all-visitor", {
        params: { page: pageNo, limit, sortType },
      });

      setVisitors(res.data.data.allVisitors || []);
      setPagination(res.data.data.pagination);
      setPage(pageNo);
    } catch {
      setErrorMsg("Failed to fetch visitors");
      setShowError(true);
    } finally {
      setShowLoader(false);
    }
  };

  /* ================= SEARCH ================= */
  useEffect(() => {
    if (!searchValue.trim()) {
      setSearchData([]);
      return;
    }

    const filtered = visitors.filter(v =>
      v.fullName.toLowerCase().includes(searchValue.toLowerCase())
    );
    setSearchData(filtered);
  }, [searchValue, visitors]);

  /* ================= IMAGE ================= */
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file?.type.startsWith("image/")) {
      setVisitorImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  /* ================= FORM ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVisitorData(prev => ({ ...prev, [name]: value }));
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

  /* ================= EFFECT ================= */
  useEffect(() => {
    fetchVisitors(1);
  }, [limit, sortType]);

  /* ================= UI ================= */
  return (
    <div className="space-y-8 px-10 py-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Employee Panel</h1>
        <ProfileDropdown
          onViewProfile={() => setViewUser("self")}
          onLogout={handleLogout}
        />
      </div>

      {/* SEARCH + FILTER */}
      <div className="border bg-white p-6 rounded shadow">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search visitor"
              className="w-full border px-4 py-2 rounded"
            />
            <Search className="absolute right-3 top-2.5 text-blue-500" size={20} />
          </div>

          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-3 py-2 border rounded text-sm"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
          </select>

          <SortFilter value={sortType} onChange={setSortType} />
        </div>

        {/* VISITOR LIST */}
        <div className="space-y-3 mt-8">
          {mapData.map((v, i) => (
            <div key={v._id} className="border p-4 rounded flex justify-between">
              <span>#{i + 1} {v.fullName}</span>
              <Eye
                className="cursor-pointer text-blue-600 hover:text-blue-700"
                onClick={() =>
                  dispatch(
                    addVisitorDetails({
                      id: v._id,
                      name: v.fullName,
                      company: v.company,
                      person: v.personToVisiting,
                      contact: v.phoneNumber,
                      work: v.work,
                      aadharDetails: v.aadharDetail,
                      image: v.visitorImage?.imageURL,
                      status: v.status,
                    })
                  )
                }
              />
            </div>
          ))}
        </div>
      </div>

      <Pagination pagination={pagination} onPageChange={fetchVisitors} />
      {toggleValue && <VisitorDetailModal />}
      {viewUser && (
        <UserDetailModal
          user={viewUser === "self" ? null : viewUser}
          isCurrentUser={viewUser === "self"}
          onClose={() => setViewUser(null)}
        />
      )}

      {showLoader && <Loader text={loaderMsg} />}
      {showError && <ErrorAlert autoClose message={errorMsg} onClose={() => setShowError(false)} />}
    </div>
  );
}
