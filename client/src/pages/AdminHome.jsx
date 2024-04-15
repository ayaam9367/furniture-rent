import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminListingItem from "../components/AdminListingItem";
import { useSelector } from "react-redux";
import AdminHeader from "../components/AdminHeader";

export default function AdminHome() {
  const [userListings, setUserListings] = useState(null);
  const [showListingsError, setShowListingsError] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    setShowListingsError(false);
    fetch(
      `/backend/adminuser/listings/${currentUser._id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, //localStorage.getItem(token)
        },
      }
    )
      .then(async (res) => res.json())
      .then((data) => {
        setUserListings(data);
      });
  }, []);

  return (
    <div>
      <AdminHeader />
      {/*top*/}
      <div className="flex justify-between p-14 px-3 max-w-6xl mx-auto">
        <h2 className="text-slate-700 font-bold text-3xl">Your Listings</h2>
        <Link to={"/create-listing"}>
          {/*make the create-listing page admin only, that means, instead of verifying whether user has signed in or not, confirm whether user is admin or not */}
          <h2 className="bg-green-700 text-white p-3 rounded-lg uppercase text-center text-xl hover:opacity-95">
            Create Listing
          </h2>
        </Link>
        <Link to={"/admin-requests"}>
          {/*make the create-listing page admin only, that means, instead of verifying whether user has signed in or not, confirm whether user is admin or not */}
          <h2 className="bg-yellow-600 text-white p-3 rounded-lg uppercase text-center text-xl hover:opacity-95">
            Your Requests
          </h2>
        </Link>
      </div>
      <hr className="p-6" />
      {userListings && (
        <div className="p-14 px-3 max-w-6xl mx-auto flex flex-wrap gap-4">
          {userListings &&
            userListings.map((listing) => (
              <AdminListingItem key={listing._id} listing={listing} />
            ))}
        </div>
      )}
    </div>
  );
}
