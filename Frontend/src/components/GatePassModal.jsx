import { X, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { get } from "../api/axiosMethods";
import Loader from "./Loader";
import ErrorAlert from "./ErrorAlert";

export default function GatePassModal({ visitorId, onClose }) {
  const [gatePass, setGatePass] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setLoading(true);
    get(`visitor/gatepass/${visitorId}`)
      .then((res) => setGatePass(res.data.data))
      .catch(() => {
        setErrorMsg("Failed to fetch gate pass");
        setShowError(true);
      })
      .finally(() => setLoading(false));
  }, [visitorId]);

  if (!gatePass) return null;

  const { visitor, gatePassNumber, entryTime } = gatePass;

  const handleDownload = () => {
    window.print(); // simple + effective (PDF print)
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-red-600"
        >
          <X />
        </button>

        <h2 className="text-xl font-semibold text-center mb-4">
          Gate Pass
        </h2>

        {/* Visitor Image */}
        <div className="flex justify-center mb-4">
          <img
            src={visitor.visitorImage?.imageURL}
            alt="Visitor"
            className="h-32 rounded border"
          />
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <p><b>Name:</b> {visitor.fullName}</p>
          <p><b>Company:</b> {visitor.company}</p>
          <p><b>Phone:</b> {visitor.phoneNumber}</p>
          <p><b>Gate Pass No:</b> {gatePassNumber}</p>
          <p><b>Entry Time:</b> {new Date(entryTime).toLocaleString()}</p>
        </div>

        {/* Download */}
        <button
          onClick={handleDownload}
          className="mt-5 w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          <Download size={18} />
          Download Gate Pass
        </button>
      </div>

      {loading && <Loader />}
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
