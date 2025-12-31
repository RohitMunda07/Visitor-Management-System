import { Users, Shield, Search, Trash2, UserPlus, Eye, X, CheckCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { closeVisitorDetails } from '../context/visitorDetailSlice';
import { get, put } from '../api/axiosMethods';
import Loader from './Loader';
import ErrorAlert from './ErrorAlert';
import { useState } from 'react';

export default function VisitorDetailModal() {

  const dispatch = useDispatch();
  const {
    value,
    id,
    name,
    company,
    person,
    contact,
    work,
    aadharDetails,
    image
  } = useSelector((state) => state.visitorDetail);

  if (!value) return null;

  const [showLoader, setShowLoader] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);

  const handleAprove = async () => {
    try {
      setShowLoader(true);
      const response = await put(`visitor/toggle-status/${id}`, {})
      console.log(response.data.message);
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Error will toggling status");
      setShowError(true)
    } finally {
      setShowLoader(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-2 border-gray-300 rounded-lg p-8 w-full max-w-4xl relative shadow-2xl">
        <button
          onClick={() => dispatch(closeVisitorDetails())}
          className="absolute top-4 right-4 text-red-600 hover:text-red-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl mb-6 text-center text-gray-800 font-semibold">
          Visitor Details
        </h2>

        {/* GRID WITH CONSISTENT SPACING */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-6">

          <div className="space-y-1">
            <label className="text-gray-700">Full Name</label>
            <input
              value={name}
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-gray-700">Company</label>
            <input
              value={company}
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-gray-700">Work</label>
            <input
              value={work}
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-gray-700">Phone Number</label>
            <input
              value={contact}
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-gray-700">Aadhar Detail</label>
            <input
              value={aadharDetails}
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-gray-700">Person To Visiting</label>
            <input
              value={person}
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-50"
            />
          </div>

          {/* IMAGE – SAME SIZE AS USER MODAL */}
          <div className="col-span-2 space-y-2">
            <label className="text-gray-700">Visitor Image</label>
            <div className="flex justify-center border border-gray-300 rounded bg-gray-50 py-3">
              <img
                src={image}
                alt="Visitor"
                className="h-40 w-auto object-contain rounded"
              />
            </div>
          </div>

          {/* APPROVE BUTTON */}
          <div className="col-span-2 flex justify-center mt-4">
            <button
              onClick={handleAprove}
              className="px-8 py-2 border bg-green-500 text-white rounded hover:bg-green-600 shadow"
            >
              Approve
            </button>
          </div>

        </div>
      </div>

      {showLoader && <Loader />}
      {showError && (
        <ErrorAlert
          autoClose
          message={errorMsg}
          onClose={() => setShowError(false)}
        />
      )}
    </div>
  );
}
