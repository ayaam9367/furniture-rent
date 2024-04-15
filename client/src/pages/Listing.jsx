import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaParking,
  FaShare,
} from "react-icons/fa";
import Contact from "../components/Contact";
import Header from "../components/Header";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState({
    imageUrls: [
      "https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630",
      "https://t3.ftcdn.net/jpg/05/71/06/04/360_F_571060419_Owx0HieYkYocICzV4W7IxmXpdmP1xo7F.jpg",
    ],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [buttonText, setButtonText ]  = useState('Send Request');
  const [requestSent, setRequestSent] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const {currentUser} = useSelector((state) => state.user);




//listingId, listingName, listingDescription, listingRent, listingDeposit, listingImages, clientId, clientName, clientEmail, sellerId, sellerName, sellerEmail, requestStatus, readStatus


  // Function to handle button click
  const sendDataToAPI = async() => {
    try {
      // Prepare the data to send
      const requestData = {
        // Add your data properties here
        listingId : params.listingId,
        listingName: listing.name ,
        listingDescription: listing.description ,
        listingRent: listing.monthlyrent ,
        listingDeposit: listing.securitydeposit ,
        listingImages: listing.imageUrls[0] ,
        clientId: currentUser._id ,
        clientName: currentUser.username ,
        clientEmail: currentUser.email ,
        sellerId: listing.userRef ,
        requestStatus: false,
        readStatus: false , 

        
      };
  
      // Make a POST request to your API endpoint
      const res = await fetch("/backend/request/create-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })  
      setTimeout(() => {
        setRequestSent(true);
        setButtonText('Request Sent');
      }, 1000);
      
    } catch (error) {
      setError(error.message);
    }
  };







  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/backend/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(false);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(false);
        setLoading(false);
      }
    };
     fetchListing();
  }, [params.listingId]);

  return (
    <main>
      <Header />
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    backgroundImage: `url(${url})`,
                    backgroundSize: "cover",
                  }}
                ></div>
                
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ${" "}
              {listing.monthlyrent}
            </p>
            
            <div className="flex gap-4">
            <button
      onClick={() => {
        if (!requestSent) {
          sendDataToAPI();
        }
      }}
      className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md"
    >
      {buttonText}
    </button>

            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Monthly Rent - </span>
              {`$ ${listing.monthlyrent}`}
            </p>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Security Deposit -  </span>
              {`$ ${listing.securitydeposit}`}
            </p>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Available for rent - </span>
              {`${listing.availableforrent} months`}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {listing.freeupgrade ? "Upgradable" : "Non upgradable"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {listing.freerelocation ? "Free relocation" : "No Free relocation"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {listing.sevendaysfreetrial ? "Free trial" : "No Free trail"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {listing.maintenance ? "Maintenance available" : "Maintenance unavailable"}
              </li>
            </ul>
           
              <button
                onClick={() => setContact(true)}
                className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
              >
                Contact landlord
              </button>
              {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}
