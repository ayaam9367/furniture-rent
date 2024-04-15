import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// listingId, listingName, listingDescription, listingRent, listingDeposit, listingImages, clientId, clientName, clientEmail, sellerId, requestStatus, readStatus

export default function PendingRequestItem({ request }) {
  const [userRequests, setUserRequests] = useState([]);
  const [requestStatus, setRequestStatus] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    requestStatus: false,
    readStatus: false,
  });

  const handleAccept = async (e) => {
    console.log(request._id);
    const updatedFormData = { ...formData };
    updatedFormData.requestStatus = true;
    updatedFormData.readStatus = true;
    const requestOptions = {
      method: "POST",
      header: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({
        ...updatedFormData,
      }),
    };

    try {
      const res = await fetch(`/backend/request/update-request/${request._id}`, 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, //localStorage.getItem(token)
        },
        body: requestOptions.body
      }
      );
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setRequestStatus(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleReject = async (e) => {
    console.log(request._id);
    const updatedFormData = { ...formData };
    updatedFormData.requestStatus = false;
    updatedFormData.readStatus = true;
    const requestOptions = {
      method: "POST",
      header: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({
        ...updatedFormData,
      }),
    };

    try {
      const res = await fetch(`/backend/request/update-request/${request._id}`, 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, //localStorage.getItem(token)
        },
        body: requestOptions.body
      }
      );
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setRequestStatus(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <img
        src={
          request.listingImages ||
          "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
        }
        alt="request cover"
        className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
      />
      <div className="p-3 flex flex-col gap-2 w-full">
        <p className="truncate text-lg font-semibold text-slate-700">
          {request.listingName}
        </p>

        <p className="text-sm text-gray-600 line-clamp-2">
          {request.listingDescription}
        </p>
        <p className="text-slate-500 mt-2 font-semibold ">
          ${request.listingRent}
        </p>
        <div className="text-slate-500 gap-4">
          <div className="font-bold text-s">
            Client Name: {request.clientName}
          </div>
        </div>
        {/* <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-xs">
              {request.sevendaysfreetrial === true
                ? "Free Trial"
                : "No Free Trial"}
            </div>
            <div className="font-bold text-xs">
              {request.maintenance === true ? "Maintenance" : ""}
            </div>
          </div>*/}
      </div>
      <div className="ml-3">
        <button onClick={handleAccept} className="text-green-700 ">
          {request.requestStatus === true && request.readStatus === true ? "Accepted" : "Accept"}
        </button>

        <button onClick={handleReject} className="text-red-700  mx-3">
          {request.requestStatus === false && request.readStatus === true ? "Rejected" : "Reject"}
        </button>
      </div>
    </div>
  );
}
