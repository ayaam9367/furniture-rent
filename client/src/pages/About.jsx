import React from "react";
import Header from "../components/Header";

export default function About() {
  return (
    <div>
      <Header />

      <div className="py-20 px-4 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-slate-800">About VRent</h1>
        <p className="mb-4 text-slate-700">
          VRent is a leading rent company that specializes in connecting clients
          to landlords in order to facilitate the process of renting desirable
          furnitures.
        </p>
        <p className="mb-4 text-slate-700">
          Associating yourself with us will make you entitles to loads of
          benefits like marginal securities, maintenance on your purchase, and
          most importantly, reliability on our roducts
        </p>
        <p className="mb-4 text-slate-700">
          Our mission is to help our clients achieve their home goals by
          providing expert advice, personalized service, and a deep
          understanding of the local market. Whether you are looking to rent
          beds, or tables, or almirahs we are here to help you every step of the
          way.
        </p>
        <p className="mb-4 text-slate-700">
          Our team of agents has a wealth of experience and knowledge in the
          home industry, and we are committed to providing the highest level of
          service to our clients. We believe that buying or selling of a
          property should be an exciting and rewarding experience, and we are
          dedicated to making that a reality for each and every one of our
          clients.
        </p>
      </div>
    </div>
  );
}
