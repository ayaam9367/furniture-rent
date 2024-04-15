import mongoose from 'mongoose';
// listingId, listingName, listingDescription, listingRent, listingDeposit, listingImages, clientId, clientName, clientEmail, sellerId, requestStatus, readStatus
const requestSchema = new mongoose.Schema(
    {
        listingId : {
            type: String,
        },

        listingName: {
            type: String,
        },

        listingDescription: {
            type: String,
        },

        listingRent: {
            type: Number,
        },

        listingDeposit: {
            type: Number,
        },

        listingImages: {
            type: String,
        },

        clientId: {
            type: String,
            required: true,
        },

        clientName: {
            type: String,
        },

    
        clientEmail: {
            type: String,
        },

        sellerId: {
            type: String,
            required: true,
        },

        requestStatus: {
            type: Boolean,
            default: false,
            required: true,
        },

        readStatus: {
            type: Boolean,
            default: false,
            required: true,
        },   
    },
    {timestamps:true}
);

const  Request = mongoose.model("request", requestSchema);
export default Request;

//listing details -> listing id, name, description, monthly rent, security deposit, image
//client details -> client id, name, email
//seller details (admin) -> seller id, name, email
//requestStatus, readStatus
