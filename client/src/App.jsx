import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/privateRoute";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";
import AdminHome from "./pages/AdminHome";
import AdminSignUp from "./pages/AdminSignUp";
import AdminSignIn from "./pages/AdminSignIn";
import AdminProfile from "./pages/AdminProfile";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import AdminRequests from "./pages/AdminRequests";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="/adminsign-up" element={<AdminSignUp />} />
        <Route path="/adminsign-in" element={<AdminSignIn />} />
        <Route element={<PrivateRoute />}>
          <Route path="/listing/:listingId" element={<Listing />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route
            path="/update-listing/:listingId"
            element={<UpdateListing />}
          />
        </Route>
        <Route element={<AdminPrivateRoute />}>
          <Route path="/admin-home" element={<AdminHome />} />
          <Route path="/admin-profile" element={<AdminProfile />} />
          <Route path = "/admin-requests" element = {<AdminRequests/>} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
