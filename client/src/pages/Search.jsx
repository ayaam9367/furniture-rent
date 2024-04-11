import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import Header from "../components/Header";

export default function Search() {
  const navigate = useNavigate();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    freetrial: true,
    relocation: true,
    maintenance: true,
    upgrade: true,
    sort: "created_at",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const freetrialFromUrl = urlParams.get("freetrial");
    const relocationFromUrl = urlParams.get("relocation");
    const maintenanceFromUrl = urlParams.get("maintenance");
    const upgradeFromUrl = urlParams.get("upgrade");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      freetrialFromUrl ||
      relocationFromUrl ||
      maintenanceFromUrl ||
      upgradeFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        freetrial: freetrialFromUrl === "true" ? true : false,
        relocation: relocationFromUrl === "true" ? true : false,
        maintenance: maintenanceFromUrl === "true" ? true : false,
        upgrade: upgradeFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(
        `/backend/listing/get?${searchQuery}`
      );
      const data = await res.json();
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }

    if (
      e.target.id === "freetrial" ||
      e.target.id === "relocation" ||
      e.target.id === "maintenance" ||
      e.target.id === "upgrade"
    ) {
      setSidebarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";

      const order = e.target.value.split("_")[1] || "desc";

      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("freetrial", sidebarData.freetrial);
    urlParams.set("relocation", sidebarData.relocation);
    urlParams.set("maintenance", sidebarData.maintenance);
    urlParams.set("upgrade", sidebarData.upgrade);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div>
      <Header/>
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen w-2/5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Perks:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="freetrial"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.freetrial === true}
              />
              <span>7 Days Free Trial</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="relocation"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.relocation === true}
              />
              <span>Free Relocation</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="maintenance"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.maintenance === true}
              />
              <span>Yearly Maintenance</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="upgrade"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.upgrade === true}
              />
              <span>Free Upgrade</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to hight</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">No listing found!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
        </div>
      </div>
    </div>
    </div>
  );
}
