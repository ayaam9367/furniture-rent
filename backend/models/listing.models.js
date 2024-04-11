import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    monthlyrent: {
      type: Number,
      required: true,
    },
    securitydeposit: {
      type: Number,
      required: true,
    },

    sevendaysfreetrial: {
      type: Boolean,
      default: false,
    },
    freerelocation: {
      type: Boolean,
      default: false,
    },
    maintenance: {
      type: Boolean,
      default: false,
    },
    freeupgrade: {
      type: Boolean,
      default: false,
    },
    availableforrent: {
      type: Number,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;

//name, description, monthly rent, security deposit, free trial, relocation, maintenance, upgrade, time of rent, images, userRef
