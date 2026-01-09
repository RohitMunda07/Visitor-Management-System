import { Users, Shield, Search, Trash2, UserPlus, Eye, X, CheckCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addVisitorDetails } from "../context/visitorDetailSlice"
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';
import VisitorDetailModal from '../components/VisitorDetailModal';
import { del, get } from '../api/axiosMethods';
import Pagination from "../components/Pagination";
import SortFilter from "../components/SortFilter";
import { SORT_TYPE } from "../constants/sortType";
import ProfileDropdown from '../components/ProfileDropdown';
import UserDetailModal from '../components/UserDetailModal';



export default function HodPage() {
  const [visitorData, setVisitorData] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toggleValue = useSelector((state) => state.visitorDetail.value);

  const [showLoader, setShowLoader] = useState(false);
  const [loaderMsg, setLoaderMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [responseData, setResponseData] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [selectedVisitors, setSelectedVisitors] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState("Get Visitors");
  const [pagination, setPagination] = useState(null);

  const [page, setPage] = useState(1);
  const [sortType, setSortType] = useState(SORT_TYPE.NEWEST);
  const [refreshKey, setRefreshKey] = useState(0);
  const [limit, setLimit] = useState(10); // default page size
  const [viewUser, setViewUser] = useState(null);
  

  const mapData = searchData.length === 0 ? visitorData : searchData;

  console.log(toggleValue);

  const handleView = (visitor) => {
    console.log(visitor);
    dispatch(addVisitorDetails({
      id: visitor._id,
      name: visitor.fullName,
      person: visitor.personToVisiting,
      contact: visitor.phoneNumber,
      company: visitor.company,
      work: visitor.work,
      aadharDetails: visitor.aadharDetail,
      image: visitor.visitorImage.imageURL,
      status: visitor.status
    }));
  };

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

  const handleDelete = async (visitorId) => {
    try {
      setShowLoader(true);
      setLoaderMsg("Deleting Visitor");
      const response = await del(`visitor/delete-visitors/${visitorId}`);
      console.log(response.data.message);
      setResponseData(response.data.message);
    } catch (error) {
      console.log("Error while deleting Visitor details", error);
      setErrorMsg(error?.response?.data?.message || "Error while deleting Visitor details");
      setShowError(true)
    } finally {
      setShowLoader(false);
      setLoaderMsg("");
    }
  }

  const onHandleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setIsSearching(!!value.trim());
  };

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setSearchData([]);
      setIsSearching(false);
      return;
    }

    try {
      const response = await get("visitor/search-visitor", {
        params: { fullName: searchValue }
      });
      setSearchData(response.data.data);
    } catch (error) {
      setSearchData([]); // important
    }
  };

  const handleSelectVisitor = (visitor) => {
    setSelectedVisitors((prev) => {
      const exists = prev.find(v => v._id === visitor._id);

      if (exists) {
        // unselect
        return prev.filter(v => v._id !== visitor._id);
      } else {
        // select
        return [
          ...prev,
          {
            _id: visitor._id,
            publicId: visitor.visitorImgae?.publicId
          }
        ];
      }
    });
  };

  const handleMultipleDelete = async () => {
    if (selectedVisitors.length === 0) return;

    try {
      setShowLoader(true);
      setLoaderMsg("Deleting Selected Visitors");

      const response = await del("visitor/delete-visitors", {
        data: {
          visitorArray: selectedVisitors
        }
      });

      setResponseData("multiple-delete");
      setSelectedVisitors([]);
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Error deleting visitors");
      setShowError(true);
    } finally {
      setShowLoader(false);
      setLoaderMsg("");
    }
  };

  const fetchVisitorsByStatus = async (status) => {
    try {
      setShowLoader(true);
      setLoaderMsg("Fetching Visitors");

      const response = await get("visitor/get-all-visitor");
      const allVisitors = response.data.data.allVisitors;

      const filtered = allVisitors.filter(
        (visitor) => visitor.status === status
      );

      setVisitorData(filtered);
    } catch (error) {
      setErrorMsg("Error while fetching visitors");
      setShowError(true);
    } finally {
      setShowLoader(false);
      setLoaderMsg("");
    }
  };

  const handlePageChange = (pageNo) => {
    fetchVisitors(pageNo);
  };

  // debounce 
  useEffect(() => {
    const delay = setTimeout(() => {
      handleSearch();
    }, 100); // ⏱ debounce time (ms)

    return () => clearTimeout(delay);
  }, [searchValue]);

  useEffect(() => {
    console.log(searchValue);
    console.log("search data", searchData);
  }, [searchValue, searchData]);

  const fetchVisitors = async (pageNo = 1) => {
    try {
      setShowLoader(true);
      setLoaderMsg("Fetching Visitors");

      const response = await get("visitor/get-all-visitor", {
        params: {
          page: pageNo,
          limit,
          sortType,
          status: filter === "Approved" ? true : false
        }
      });

      setVisitorData(response.data.data.allVisitors);
      setPagination(response.data.data.pagination);
      setPage(pageNo);

    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Error fetching visitors");
      setShowError(true);
    } finally {
      setShowLoader(false);
      setLoaderMsg("");
    }
  };

  useEffect(() => {
    fetchVisitors(1);
  }, [responseData, limit, filter, sortType, refreshKey]);

  return (
    <div className="space-y-8 inset-0 px-10 py-8">
      {/* Upper section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">HOD Pannel</h1>

        <ProfileDropdown
          onViewProfile={() => setViewUser("self")}
          onLogout={handleLogout}
        />
      </div>


      {/* Search Bar */}
      <div className="border-2 border-gray-300 bg-white p-6 rounded-lg shadow">
        <div className="flex gap-4 items-center mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search"
              value={searchValue}
              onChange={(e) => onHandleSearch(e)}
              className="w-full bg-white border border-gray-300 px-4 py-2 pr-10 rounded focus:outline-none focus:border-blue-500 text-gray-800"
            />
            <Search
              onClick={handleSearch}
              className="absolute right-3 top-2.5 text-blue-500 cursor-pointer" size={20} />
          </div>

          <div className="relative">
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded text-sm bg-white shadow 
               focus:outline-none focus:border-blue-500"
            >
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>

          <SortFilter
            value={sortType}
            onChange={setSortType}
          />

          <div className="relative">
            {/* Trigger Button */}
            <button
              onClick={() => setShowFilter(prev => !prev)}
              className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded 
               hover:bg-gray-100 text-sm shadow flex items-center gap-2"
            >
              {filter}
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            {showFilter && (
              <div className="absolute mt-2 w-full bg-white border border-gray-300 
                    rounded shadow z-20">
                {["Get Visitors", "Approved"].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setFilter(item);
                      setShowFilter(false);

                      if (item === "Approved") {
                        fetchVisitorsByStatus(true);
                      }

                      if (item === "Get Visitors") {
                        fetchVisitorsByStatus(false);
                      }
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 
               hover:bg-gray-100"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleMultipleDelete}
            disabled={selectedVisitors.length === 0}
            className={`px-4 py-2 border text-sm shadow rounded
            ${selectedVisitors.length === 0
                ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                : "border-red-300 bg-red-50 text-red-600 hover:bg-red-100"
              }`}
          >
            Delete Visitors
          </button>

        </div>

        {/* Visitor List */}
        <div className="mt-6 space-y-3">
          {isSearching && searchData.length === 0 ? (
            <div className="text-center text-gray-500 mt-4">
              No record found
            </div>
          ) : (
            mapData.map((visitor, index) => (
              <div
                key={index + 1}
                className="border border-gray-300 bg-white p-4 rounded hover:border-blue-400 transition-colors shadow-sm cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <input
                      type="checkbox"
                      checked={selectedVisitors.some(v => v._id === visitor._id)}
                      onChange={() => handleSelectVisitor(visitor)}
                      className="mr-3 cursor-pointer"
                    />

                    <span className="text-gray-700">
                      #{index + 1} - {visitor.fullName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleView(visitor)}
                      className="px-4 py-1 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-100 text-sm shadow-sm"
                    >
                      View
                    </button>
                    {/* <button
                      onClick={() => handleDelete(visitor._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X cursor={"pointer"} size={24} />
                    </button> */}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {toggleValue && (
        <VisitorDetailModal
          onApproved={() => setRefreshKey(prev => prev + 1)}
        />
      )}

      {showLoader && <Loader text={loaderMsg} />}
      {showError &&
        <ErrorAlert
          autoClose={true}
          message={errorMsg}
          onClose={() => setShowError(false)}
        />}

      <Pagination
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      {viewUser && (
        <UserDetailModal
          user={viewUser === "self" ? null : viewUser}
          isCurrentUser={viewUser === "self"}
          onClose={() => setViewUser(null)}
        />
      )}


    </div>
  );
}