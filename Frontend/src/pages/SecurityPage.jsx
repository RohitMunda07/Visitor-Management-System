import { Search, Eye, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import ErrorAlert from "../components/ErrorAlert";
import Pagination from "../components/Pagination";
import SortFilter from "../components/SortFilter";
import ProfileDropdown from "../components/ProfileDropdown";
import VisitorDetailModal from "../components/VisitorDetailModal";
import { get, post } from "../api/axiosMethods";
import { SORT_TYPE } from "../constants/sortType";
import { addVisitorDetails } from "../context/visitorDetailSlice";
import { Download } from "lucide-react";
import GatePassModal from "../components/GatePassModal";
import { useNavigate } from "react-router-dom";


export default function SecurityPage() {
  const dispatch = useDispatch();
  const toggleValue = useSelector((state) => state.visitorDetail.value);
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortType, setSortType] = useState(SORT_TYPE.NEWEST);

  const [showLoader, setShowLoader] = useState(false);
  const [loaderMsg, setLoaderMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);
  const [gatePassVisitorId, setGatePassVisitorId] = useState(null);
  const [viewUser, setViewUser] = useState(null);


  const mapData = searchData.length === 0 ? visitors : searchData;

  /* ================= FETCH APPROVED VISITORS ================= */
  const fetchApprovedVisitors = async (pageNo = 1) => {
    try {
      setShowLoader(true);
      setLoaderMsg("Fetching Approved Visitors");

      const response = await get("visitor/get-all-visitor", {
        params: {
          page: pageNo,
          limit,
          sortType,
          status: true, // ✅ ONLY APPROVED VISITORS
        },
      });

      setVisitors(response.data.data.allVisitors || []);
      setPagination(response.data.data.pagination);
      setPage(pageNo);
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Failed to fetch visitors");
      setShowError(true);
    } finally {
      setShowLoader(false);
      setLoaderMsg("");
    }
  };

  /* ================= SEARCH (DEBOUNCE) ================= */
  const handleSearch = () => {
    if (!searchValue.trim()) {
      setSearchData([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const filtered = visitors.filter((v) =>
      v.fullName.toLowerCase().includes(searchValue.toLowerCase())
    );
    setSearchData(filtered);
  };

  /* ================= Logout User ================= */
  const handleLogout = async () => {
    try {
      setShowLoader(true);
      setLoaderMsg("Logging Out")
      const response = await get("auth/logout");
      console.log(response.data.message);
      sessionStorage.clear();
      navigate("/");
    } catch (error) {
      console.log("Error while logout", error);
      setErrorMsg(error.message);
    } finally {
      setShowLoader(false);
      setLoaderMsg("");
    }
  }


  useEffect(() => {
    const delay = setTimeout(handleSearch, 300);
    return () => clearTimeout(delay);
  }, [searchValue]);

  /* ================= GATE PASS ================= */
  const generateGatePass = async (visitorId) => {
    try {
      setShowLoader(true);
      setLoaderMsg("Generating Gate Pass");

      await post(`visitor/generate-gatepass/${visitorId}`, {});
      // alert("Gate Pass Generated Successfully");

      // re-fetch the updated visitors
      await fetchApprovedVisitors(page);
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Failed to generate gate pass");
      setShowError(true);
    } finally {
      setShowLoader(false);
      setLoaderMsg("");
    }
  };

  /* ================= EFFECT ================= */
  useEffect(() => {
    fetchApprovedVisitors(1);
  }, [limit, sortType, gatePassVisitorId]);

  return (
    <div className="space-y-8 px-10 py-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Security Panel</h1>
        <ProfileDropdown
          onViewProfile={() => setViewUser("self")}
          onLogout={handleLogout}
        />
      </div>

      {/* SEARCH + FILTERS */}
      <div className="border bg-white p-6 rounded shadow">
        <div className="flex gap-4 mb-4 items-center">
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
        <div className="space-y-3">
          {mapData.length === 0 ? (
            <p className="text-center text-gray-500">No visitors found</p>
          ) : (
            mapData.map((visitor, index) => (
              <div
                key={visitor._id}
                className="border p-4 rounded flex justify-between items-center"
              >
                <span className="font-medium capitalize">
                  #{index + 1} {visitor.fullName}
                </span>

                <div className="flex gap-3 items-center">
                  {/* VIEW VISITOR */}
                  <Eye
                    className="text-blue-600 cursor-pointer hover:text-blue-700"
                    onClick={() =>
                      dispatch(
                        addVisitorDetails({
                          id: visitor._id,
                          name: visitor.fullName,
                          person: visitor.personToVisiting,
                          contact: visitor.phoneNumber,
                          company: visitor.company,
                          work: visitor.work,
                          aadharDetails: visitor.aadharDetail,
                          image: visitor.visitorImage?.imageURL,
                          status: visitor.status,
                        })
                      )
                    }
                  />

                  {/* GENERATE */}
                  <button
                    disabled={!visitor.status}
                    onClick={() => generateGatePass(visitor._id)}
                    className={`px-3 py-1 text-sm rounded border ${visitor.status
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-400"
                      }`}
                  >
                    <Ticket size={16} />
                  </button>

                  {/* DOWNLOAD (ONLY IF GATE PASS EXISTS) */}
                  {visitor.gatePassGenerated && (
                    <Download
                      size={18}
                      className="text-indigo-600 cursor-pointer hover:text-indigo-700"
                      onClick={() => setGatePassVisitorId(visitor._id)}
                    />
                  )}

                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {viewUser && (
        <UserDetailModal
          user={viewUser === "self" ? null : viewUser}
          isCurrentUser={viewUser === "self"}
          onClose={() => setViewUser(null)}
        />
      )}
      
      <Pagination
        pagination={pagination}
        onPageChange={fetchApprovedVisitors}
      />

      {/* VISITOR MODAL */}
      {toggleValue && <VisitorDetailModal />}

      {showLoader && <Loader text={loaderMsg} />}
      {showError && (
        <ErrorAlert
          autoClose
          message={errorMsg}
          onClose={() => setShowError(false)}
        />
      )}

      {gatePassVisitorId && (
        <GatePassModal
          visitorId={gatePassVisitorId}
          onClose={() => setGatePassVisitorId(null)}
        />
      )}

    </div>
  );
}
