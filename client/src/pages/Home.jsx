import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import {
  FcFilingCabinet, //quality product
  FcLandscape, //location
  FcSupport, //maintenance
  FcCancel, //cancelation
  FcRedo, //returns
  FcUpload, //upgrade
} from "react-icons/fc";
import Header from "../components/Header";

export default function Home() {
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  useEffect(() => {
    const fetchRentListings = async () => {
      try {
        const res = await fetch(
          "/backend/listing/get?type=rent&limit=4"
        );
        const data = await res.json();
        setRentListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    fetchRentListings();
  }, []);
  return (
    <div>
      <Header />
      {/* top */}
      <div className="flex flex-col gap-6 p-12 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-8xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          furniture with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
          blanditiis officiis nostrum delectus autem itaque officia quibu
          <br />
          We have a wide range of products for you to choose from.
        </div>
        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          Let's get you started...
        </Link>
      </div>

      {/* swiper */}
      <Swiper navigation>
        {rentListings &&
          rentListings.length > 0 &&
          rentListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        <div className="">
          <div className="my-3">
            <h2 className="text-2xl font-semibold text-slate-600">
              Recent items for rent
            </h2>
            <Link
              className="text-sm text-blue-800 hover:underline"
              to={"/search"}
            >
              Show more items for rent
            </Link>
          </div>
          <div className="flex flex-wrap gap-4">
            {rentListings.map((listing) => (
              <ListingItem listing={listing} key={listing._id} />
            ))}
          </div>
        </div>
        <hr />
        <h2 className="text-2xl font-semibold text-slate-600">
          There is more to renting
        </h2>
        <div>
          <ul className="text-sm items-center gap-4 sm:gap-6">
            <div className="flex gap-5 text-center mb-10">
              <li className="flex items-center gap-1">
                <div className="flex flex-col items-center gap-1 ">
                  <FcFilingCabinet className="text-8xl" />
                  <h3 className="font-semibold text-slate-600">Finest Quality Products</h3>
                  <p className="text-black ">
                  Quality matters to you, and us! That's why we do a strict quality-check for every product.
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-1">
                <div className="flex flex-col items-center gap-1">
                  <FcLandscape className="text-8xl" />
                  <h3 className="font-semibold text-slate-600">Easy Relocation</h3>
                  <p>
                  Changing your house or even your city? We'll relocate your rented products for free.
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-1">
                <div className="flex flex-col items-center gap-1">
                  <FcSupport className="text-8xl" />
                  <h3 className=" font-semibold text-slate-600">Best Customer Support</h3>
                  <p>
                  Keeping your rented products in a spick and span condition is on us, so you can sit back and relax.
                  </p>
                </div>
              </li>
            </div>
            <div className="flex text-center gap-5">
              <li className="flex items-center gap-1">
                <div className="flex flex-col items-center gap-1">
                  <FcUpload className="text-8xl" />
                  <h3 className="font-semibold text-slate-600">Upgrades Available</h3>
                  <p>
                  Bored of the same product? Upgrade to try another, newer design and enjoy the change!
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-1">
                <div className="flex flex-col items-center gap-1">
                  <FcCancel className="text-8xl" />
                  <h3 className="font-semibold text-slate-600">Cancel Anytime</h3>
                  <p>
                  Pay only for the time you use the product and close your subscription without any hassle.
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-1">
                <div className="flex flex-col items-center gap-1">
                  <FcRedo className="text-8xl" />
                  <h3 className="font-semibold text-slate-600">Easy Returns</h3>
                  <p>
                  If you don't like the product on delivery, you can return it right away—no questions asked.
                  </p>
                </div>
              </li>
            </div>
          </ul>
        </div>
        <Link className="text-sm text-blue-800 hover:underline" to={"/about"}>
          Know more
        </Link>
      </div>
    </div>
  );
}
