import { useEffect, useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AdminHeader from '../components/AdminHeader';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    monthlyrent: 50,
    securitydeposit: 50,
    sevendaysfreetrial: false,
    freerelocation: false,
    freeupgrade: false,
    maintenance: false,
    availableforrent: 3,
  });

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      console.log(listingId);
      const res = await fetch(`/backend/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, []);




  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
   

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      const promises = [];
      setUploading(true);
      setImageUploadError(false);
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (
      e.target.id === "sevendaysfreetrial" ||
      e.target.id === "freerelocation" ||
      e.target.id === "maintenance"||
      e.target.id === "freeupgrade"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

      if (
        e.target.type === "number" ||
        e.target.type === "text" ||
        e.target.type === "textarea"
      ) {
        setFormData({
          ...formData,
          [e.target.id]: e.target.value,
        });
      }
    }

    const handleSubmit = async(e) => {
      e.preventDefault();
      try {
        if (formData.imageUrls.length < 1)
          return setError('You must upload at least one image');
        setLoading(true);
        setError(false);
        const requestOptions = {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("access_token")}`   //localStorage.getItem(token)
          }
        };
        console.log("inside handle submit updateListing 1");
        const res = await fetch(`/backend/listing/update/${params.listingId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
          },
          body: JSON.stringify({
            ...formData,
            userRef: currentUser._id,
          }),
        });
        const data = await res.json();
        setLoading(false);
        if (data.success === false) {
          setError(data.message);
        }
        navigate(`/listing/${data._id}`);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    return (
      <div>
        <AdminHeader />
      <main className="p-3 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">
          Update a Listing
        </h1>
        <form onSubmit = {handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col gap-4 flex-1">
            <input
              type="text"
              placeholder="Name"
              className="border p-3 rounded-lg"
              id="name"
              maxLength="62"
              minLength="10"
              required
              onChange={handleChange}
              value={formData.name}
            />
            <textarea
              type="text"
              placeholder="Description"
              className="border p-3 rounded-lg"
              id="description"
              required
              onChange={handleChange}
              value={formData.description}
            />
            <div className="flex gap-6 flex-wrap">
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="sevendaysfreetrial"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.sevendaysfreetrial}
                />
                <span>7 days free trial</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="freerelocation"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.freerelocation}
                />
                <span>Free relocation</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="freeupgrade"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.freeupgrade}
                />
                <span>Upgrade</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="maintenance"
                  className="w-5"
                  onChange={handleChange}
                  checked={formData.maintenance}
                />
                <span>Yearly maintenance</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="monthlyrent"
                  min="1"
                  max="100000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.monthlyrent}
                />
                <div className="flex flex-col items-center">
                  <p>Monthly Rent</p>
                  <span className="text-xs">($/month)</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="securitydeposit"
                  min="1"
                  max="100000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.securitydeposit}
                />
                <div className="flex flex-col items-center">
                  <p>Refundable Deposit</p>
                </div>
              </div>
              <div className="flex items-center gap-2 ">
                <input
                  type="number"
                  id="availableforrent"
                  min="1"
                  max="240000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.availableforrent}
                />
                <div className="flex flex-col items-center">
                  <p>Available for rent</p>
                  <span className="text-xs">(months)</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-1 gap-4">
            <p className="font-semibold">
              Images:
              <span className="font-normal text-gray-600 ml-2">
                The first image will be the cover (max 6)
              </span>
            </p>
            <div className="flex gap-4">
              <input
                onChange={(e) => setFiles(e.target.files)}
                className="p-3 border border-gray-300 rounded w-full"
                type="file"
                id="images"
                accept="image/*"
                multiple
              />
              <button
                type="button"
                disabled={uploading}
                onClick={handleImageSubmit}
                className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>

            <p className="text-red-700 text-sm">
              {imageUploadError && imageUploadError}
            </p>
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div
                  key={url}
                  className="flex justify-between p-3 border items-center"
                >
                  <img
                    src={url}
                    alt="listing image"
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                  >
                    Delete
                  </button>
                </div>
              ))}
            <button disabled = {loading || uploading} className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
              {loading || uploading ? 'Updating...' : 'Update Listing'}
            </button>
            {error && <p className = 'text-red-700 text-sm'>{error}</p>}
          </div>
        </form>
      </main>
      </div>
    );
  };

