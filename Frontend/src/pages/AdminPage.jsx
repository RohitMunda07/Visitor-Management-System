import { Users, Shield, Search, Trash2, UserPlus, Eye, X, CheckCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addVisitorDetails } from "../context/visitorDetailSlice"
import { useEffect, useState } from 'react';
import Loader from '../components/Loader';


export default function AdminPage({ onLogout, onSwitchToSecurity, onViewVisitor }) {
  const visitorData = [
    { id: 1, name: 'Rajesh Kumar', person: 'Manager', contact: '9876543210', company: 'Tech Corp', work: "meet-up", addharDetails: "8100-5551-0091" },
    { id: 2, name: 'Priya Sharma', person: 'HR Head', contact: '9876543211', company: 'InfoSys', work: "meet-up", addharDetails: "8100-5551-0091" },
    { id: 3, name: 'Amit Patel', person: 'Director', contact: '9876543212', company: 'Reliance', work: "meet-up", addharDetails: "8100-5551-0091" },
    { id: 4, name: 'Sneha Singh', person: 'CEO', contact: '9876543213', company: 'Wipro', work: "meet-up", addharDetails: "8100-5551-0091" }
  ];

  const dispatch = useDispatch();
  const [showLoader, setShowLoader] = useState(false);
  const toggleValue = useSelector((state) => state.visitorDetail.value);
  console.log(toggleValue);

  const handleView = (visitor) => {
    dispatch(addVisitorDetails({
      id: visitor.id,
      name: visitor.name,
      person: visitor.person,
      contact: visitor.contact,
      company: visitor.company,
      work: visitor.work,
      aadharDetails: visitor.addharDetails, // ⚠️ spelling fix
    }));
  };

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
            onClick={onLogout}
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
          {visitorData.map((visitor) => (
            <div
              key={visitor.id}
              className="border border-gray-300 bg-white p-4 rounded hover:border-blue-400 transition-colors shadow-sm cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <span className="text-gray-700">#{visitor.id} - {visitor.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleView(visitor)}
                    className="px-4 py-1 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-100 text-sm shadow-sm"
                  >
                    View
                  </button>
                  <button className="text-green-600 hover:text-green-700">
                    <CheckCircle cursor={"pointer"} size={20} />
                  </button>
                  <button className="text-red-600 hover:text-red-700">
                    <X cursor={"pointer"} size={24} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showLoader && <Loader />}
    </div>
  );
}