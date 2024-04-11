import React, { useState, useEffect } from "react";
import AdminHeader from "../components/AdminHeader";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PendingRequestItem from "../components/PendingRequestItem";

export default function AdminRequests() {
  const { currentUser } = useSelector((state) => state.user);
  const [userRequests, setUserRequests] = useState(null);
  const [showRequestError, setShowRequestError] = useState(false);

  useEffect(() => {
    setShowRequestError(false);
    fetch(
        `/backend/request/get-request/${currentUser._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`, 
          },
        }
      )
        .then(async (res) => res.json())
        .then((data) => {
            console.log(data);
          setUserRequests(data);
        });
  }, [])

  return (
    <div>
      <AdminHeader />

      <div className="p-7 font-medium text-slate-800 mt-7 mx-14">
        <span>
          You will see pending requests here. You can accept or reject them !{" "}
        </span>
      </div>
      <hr />
      <div className="p-7 flex justify-between mx-14 font-medium text-slate-800">
        <div>
        Pending Requests

        {userRequests && (
        <div className="p-14 px-3 mx-auto flex flex-wrap gap-4">
          {userRequests &&
            userRequests.map((request) => (
              <PendingRequestItem key={request._id} request={request} />
            ))}
        </div>
      )}

        </div>
      </div>
    </div>
  );
}
