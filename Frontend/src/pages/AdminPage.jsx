import { Users, Shield, Search, Trash2, UserPlus, Eye, X, CheckCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addVisitorDetails } from "../context/visitorDetailSlice"
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';
import VisitorDetailModal from '../components/VisitorDetailModal';
import { del, get } from '../api/axiosMethods';


export default function AdminPage() {
  const [visitorData, setVisitorData] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toggleValue = useSelector((state) => state.visitorDetail.value);
  const [showLoader, setShowLoader] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);

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
      image: visitor.visitorImgae.imageURL,
    }));
  };

  const handleLogout = async () => {
    try {
      setShowLoader(true);
      const response = await get("auth/logout");
      console.log(response.data.message);
      sessionStorage.clear();
      navigate("/");
    } catch (error) {
      console.log("Error while logout", error);
    } finally {
      setShowLoader(false);
    }
  }

  const handleDelete = async () => {
    try {
      const response = await del("visitor/delete-visitors");
      console.log(response.data.message);
    } catch (error) {
      console.log("Error while deleting Visitor details", error);
      setErrorMsg(error?.response?.data?.message || "Error while deleting Visitor details");
      setShowError(true)
    } finally {
      setShowLoader(false)
    }
  }

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        setShowLoader(true);
        const response = await get("visitor/get-all-visitor");
        console.log(response.data.data);
        const getAllVisitors = response.data.data.allVisitors
        const filterVisitors = getAllVisitors.filter((visitor) => visitor.status === false);
        setVisitorData(filterVisitors);
      } catch (error) {
        console.log("Error while fetching Visitor details", error);
        setErrorMsg(error?.response?.data?.message || "Error while fetching Visitor details");
        setShowError(true)
      } finally {
        setShowLoader(false)
      }
    };

    fetchVisitors();
  }, []);

  return (
    <div className="space-y-8 inset-0 px-10 py-8">
      {/* Upper section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Page</h1>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-100 shadow">
            Get All Users
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-100 shadow"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="border-2 border-gray-300 bg-white p-6 rounded-lg shadow">
        <div className="flex gap-4 items-center mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-white border border-gray-300 px-4 py-2 pr-10 rounded focus:outline-none focus:border-blue-500 text-gray-800"
            />
            <Search className="absolute right-3 top-2.5 text-blue-500 cursor-pointer" size={20} />
          </div>
          <button className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-100 text-sm shadow">
            Approved
          </button>
          <button className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-100 text-sm shadow">
            Rejected
          </button>
          <button className="px-4 py-2 border border-red-300 bg-red-50 text-red-600 rounded hover:bg-red-100 text-sm shadow">
            Delete Visitors
          </button>
        </div>

        {/* Visitor List */}
        <div className="mt-6 space-y-3">
          {visitorData.map((visitor, index) => (
            <div
              key={index + 1}
              className="border border-gray-300 bg-white p-4 rounded hover:border-blue-400 transition-colors shadow-sm cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <span className="text-gray-700">#{index + 1} - {visitor.fullName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleView(visitor)}
                    className="px-4 py-1 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-100 text-sm shadow-sm"
                  >
                    View
                  </button>
                  {/* <button
                    className="text-green-600 hover:text-green-700">
                    <CheckCircle cursor={"pointer"} size={20} />
                  </button> */}
                  <button
                    onClick={handleDelete}
                    className="text-red-600 hover:text-red-700">
                    <X cursor={"pointer"} size={24} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {toggleValue && <VisitorDetailModal />}
      {showLoader && <Loader />}
      {showError &&
        <ErrorAlert
          autoClose={true}
          message={errorMsg}
          onClose={() => setShowError(false)}
        />}
    </div>
  );
}