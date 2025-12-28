import { Users, Shield, Search, Trash2, UserPlus, Eye, X, CheckCircle } from 'lucide-react';


export default function SecurityPage({ onLogout, onSwitchToAdmin }) {
  return (
    <div className="space-y-3 inset-0 px-10 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Security Page</h1>
        <button
          onClick={onLogout}
          className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-100 shadow"
        >
          Logout
        </button>
      </div>

      {/* Search Bar */}
      {/* <div className="border-2 border-gray-300 bg-white p-4 rounded-lg shadow">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-white border border-gray-300 px-4 py-2 pr-10 rounded focus:outline-none focus:border-green-500 text-gray-800"
            />
            <Search className="absolute right-3 top-2.5 text-green-500 cursor-pointer" size={20} />
          </div>
        </div>
      </div> */}

      {/* Visitor Form */}
      <div className="border-2 border-gray-300 bg-white px-5 py-3 rounded-lg w-full shadow">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block mb-2 text-gray-700">fullName</label>
            <input
              type="text"
              className="w-full bg-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-green-500 text-gray-800"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-gray-700">company</label>
            <input
              type="text"
              className="w-full bg-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-green-500 text-gray-800"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-gray-700">work</label>
            <input
              type="text"
              className="w-full bg-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-green-500 text-gray-800"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700">phoneNumber</label>
            <input
              type="text"
              className="w-full bg-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-green-500 text-gray-800"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700">aadharDetail</label>
            <input
              type="text"
              className="w-full bg-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-green-500 text-gray-800"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-gray-700">personToVisiting</label>
            <input
              type="text"
              className="w-full bg-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-green-500 text-gray-800"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-gray-700">Visitor Image</label>
            <input
              type="file"
              accept="image/*"
              className="w-full bg-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-green-500 text-gray-800 file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:bg-green-500 file:text-white hover:file:bg-green-600"
            />
          </div>

          <div className="col-span-2 flex justify-center mt-4">
            <button className="px-8 py-2 border border-gray-300 bg-green-500 text-white rounded hover:bg-green-600 transition-colors shadow">
              Forward
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}