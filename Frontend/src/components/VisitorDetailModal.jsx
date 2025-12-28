import { Users, Shield, Search, Trash2, UserPlus, Eye, X, CheckCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { closeVisitorDetails } from '../context/visitorDetailSlice';

export default function VisitorDetailModal() {

  const dispatch = useDispatch();
  const {
    value,
    name,
    company,
    person,
    contact,
    work,
    aadharDetails
  } = useSelector((state) => state.visitorDetail);

  if (!value) return null;

  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4`}>
      <div className="bg-white border-2 border-gray-300 rounded-lg p-8 w-full max-w-4xl relative shadow-2xl">
        <button
          onClick={() => dispatch(closeVisitorDetails())}
          className="absolute top-4 right-4 text-red-600 hover:text-red-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl mb-6 text-center text-gray-800 font-semibold">Visitor's Detail</h2>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-gray-700">fullName</label>
            <input
              type="text"
              value={name}
              readOnly
              className="w-full bg-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-gray-800"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700">company</label>
            <input
              type="text"
              value={company}
              readOnly
              className="w-full bg-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-gray-800"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700">work</label>
            <input
              type="text"
              value={work}
              readOnly
              className="w-full bg-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-gray-800"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700">phoneNumber</label>
            <input
              type="text"
              value={contact}
              readOnly
              className="w-full bg-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-gray-800"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700">aadharDetail</label>
            <input
              type="text"
              value={aadharDetails}
              readOnly
              className="w-full bg-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-gray-800"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700">personToVisiting</label>
            <input
              type="text"
              value={person}
              readOnly
              className="w-full bg-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 text-gray-800"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-gray-700">Visitor Image</label>
            <div className="w-full border border-gray-300 px-3 py-2 rounded bg-gray-50">
              <span className="text-gray-600">visitor_image.jpg</span>
            </div>
          </div>

          <div className="col-span-2 flex justify-center mt-4">
            <button className="px-8 py-2 border border-gray-300 bg-green-500 text-white rounded hover:bg-green-600 shadow">
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}