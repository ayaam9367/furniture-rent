import React, { useState } from "react";
import { Link } from "react-router-dom";
import {useNavigate} from 'react-router-dom';

export default function AdminListingItem({ listing }) {
  const [userListings, setUserListings] = useState([]);
  const navigate = useNavigate();

  const handleClick = async () => {
    navigate(`/update-listing/${listing._id}`);
  }

  const handleListingDelete = async (listingId) => {
    
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`, //localStorage.getItem(token)
      },
    };
    try {
      const res = await fetch(
        `/backend/listing/delete/${listingId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`, //localStorage.getItem(token)
          },
        }
      );
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageUrls[0] ||
            "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
          }
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold text-slate-700">
            {listing.name}
          </p>

          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <p className="text-slate-500 mt-2 font-semibold ">
            ${listing.monthlyrent}
          </p>
          <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-xs">
              {listing.sevendaysfreetrial === true
                ? "Free Trial"
                : "No Free Trial"}
            </div>
            <div className="font-bold text-xs">
              {listing.maintenance === true ? "Maintenance" : ""}
            </div>
          </div>
          
        </div>
        </Link>
          <div className="p-3">
           
              <button onClick={() => handleClick()} className="text-green-700 uppercase">Edit</button>
           

            <button
              onClick={() => handleListingDelete(listing._id)}
              className="text-red-700 uppercase mx-3"
            >
              DELETE
            </button>
          </div>
    </div>
  );
}
