import mongoose from 'mongoose';

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
    monthlyRent: {
      type: Number,
      required: true,
    },
    securityDeposit: {
      type: Number,
      required: true,
    },
    sevenDaysFreeTrial: {
      type: Boolean,
      default: false,
    },
    freeRelocation: {
      type: Boolean,
      default: false,
    },
    freeUpgrade: {
      type: Boolean,
      default: false,
    },
    availableForRent: {
      type: Number,
      required: true,
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

const Listing = mongoose.model('Lisiting', listingSchema);

export default Listing;
