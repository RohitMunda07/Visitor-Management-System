import { useEffect, useState } from 'react';
import { get, post } from '../api/axiosMethods';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';


export default function SecurityPage({ onLogout }) {
  // visitorImgae
  const [visitorData, setVisitorData] = useState({
    name: "",
    person: "",
    contact: "",
    company: "",
    work: "",
    aadharDetails: ""
  });

  const [visitorImage, setVisitorImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file && file.type.startsWith("image/")) {
      setVisitorImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      alert("Please select a valid image file");
    }
  }

  const handleOnChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target
    setVisitorData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleFroward = async () => {
    const formData = new FormData();
    formData.append("fullName", visitorData.name);
    formData.append("company", visitorData.company);
    formData.append("work", visitorData.name);
    formData.append("phoneNumber", visitorData.contact);
    formData.append("aadharDetail", visitorData.aadharDetails);
    formData.append("personToVisiting", visitorData.person);
    formData.append("visitorImgae", visitorImage);

    try {
      setShowLoader(true);
      const response = await post("visitor/insert-visitor", formData, {
        "Content-Type": "multipart/form-data"
      });

      console.log("data inserted:", response.data);

    } catch (error) {
      console.log("error while inserting data", error);
      setErrorMsg(error.message);
      setShowError(true);
    } finally {
      setShowLoader(false);
    }

    setVisitorData({
      name: "",
      person: "",
      contact: "",
      company: "",
      work: "",
      aadharDetails: "",
    });

    setPreview(null);
    setVisitorImage(null);
  }

  useEffect(() => {
    console.log("user form data", visitorData);
  },)

  return (
    <div className="space-y-3 inset-0 px-10 py-8 relative">
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
              name="name"
              value={visitorData.name}
              onChange={handleOnChange}
              required
              className="w-full bg-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-green-500 text-gray-800"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-gray-700">company</label>
            <input
              type="text"
              name="company"
              value={visitorData.company}
              onChange={handleOnChange}
              required
              className="w-full bg-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-green-500 text-gray-800"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-gray-700">work</label>
            <input
              type="text"
              name="work"
              value={visitorData.work}
              onChange={handleOnChange}
              required
              className="w-full bg-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-green-500 text-gray-800"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700">phoneNumber</label>
            <input
              type="text"
              name="contact"
              value={visitorData.contact}
              onChange={handleOnChange}
              required
              className="w-full bg-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-green-500 text-gray-800"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700">aadharDetail</label>
            <input
              type="text"
              name="aadharDetails"
              value={visitorData.aadharDetails}
              onChange={handleOnChange}
              required
              className="w-full bg-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-green-500 text-gray-800"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-gray-700">personToVisiting</label>
            <input
              type="text"
              name="person"
              value={visitorData.person}
              onChange={handleOnChange}
              required
              className="w-full bg-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-green-500 text-gray-800"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-2 text-gray-700">Visitor Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              required
              className="w-full bg-white border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-green-500 text-gray-800 file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:bg-green-500 file:text-white hover:file:bg-green-600"
            />
            <div className='mt-3 flex justify-center'>
              <img
                className='w-2xl'
                src={preview}
                alt="" />
            </div>
          </div>

          <div className="col-span-2 flex justify-center mt-4">
            <button
              onClick={handleFroward}
              className="px-8 py-2 border border-gray-300 bg-green-500 text-white rounded hover:bg-green-600 transition-colors shadow">
              Forward
            </button>
          </div>

          {showLoader && <Loader text={"Adding Data"} size='medium' />}

          {showError &&
            <ErrorAlert
              autoClose={true}
              message={errorMsg}
              onClose={() => setShowError(false)}
            />}

        </div>
      </div>
    </div>
  );
}