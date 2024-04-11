import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {useNavigate} from 'react-router-dom';

export default function PendingRequestItem({ request }) {
  const [userRequests, setUserRequests] = useState({
    clientrequest: null,
    client: null,
    listing: null
});
  const navigate = useNavigate();  

  useEffect(() => {
    fetch(
      `http://localhost:5001/backend/request/get-requestDetails/${request._id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, 
        },
      }
    ).then(async(res) => res.json())
     .then((data) => {
      setUserRequests(data);
    })
    const client = userRequests.client;    
    const listing = userRequests.listing;    
    const clientrequest = userRequests.request;

    console.log(client);
    console.log(listing);
    console.log(clientrequest);     
  }, [])



  return (
    <div>
         
    </div>
  );
}
