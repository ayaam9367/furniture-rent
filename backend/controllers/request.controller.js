import { errorHandler } from '../utils/error.js';
import Request from '../models/request.models.js';
import User from '../models/user.models.js';
import Listing from '../models/listing.models.js';
import { Types } from 'mongoose';

export const createRequest = async(req, res, next) => {
    try{
        const request = await Request.create(req.body);
        res.status(201).json(request);
    }catch(error){
        next(error);
    }
}

//shows requests to the seller (admin) which requests are made to him
export const getRequest = async(req, res, next) => {    
        try{
            const requests = await Request.find({sellerId : req.params.id});
            res.status(200).json(requests); 
        }catch(error){
            next(error);
        }
}


//shows requests to the user (client)
export const getUserRequest = async(req, res, next) => {
    try {
        const requests = await Request.find({clientId : req.params.id });
        res.status(200).json(requests);
    } catch (error) {
        next(error);
    }
}



//gets complete request details
export const getRequestDetails = async(req, res, next) => {
    try{ 
        
        const request = await Request.find({_id:req.params.id });
        if(!request){
            res.status(404).json("Request not found");
        }
      
        const clientId = request[0].clientId;
        const listingId = request[0].listingId;

        const client = await User.find({_id : new Types.ObjectId(clientId)});
        const listing = await Listing.findOne({_id: new Types.ObjectId(listingId)});

        res.status(200).json({request, client, listing});

    }catch(error){
        next(error);
    }
}

export const updateRequest = async(req, res, next) => {
    console.log("inside update request controller")
    const request = await Request.findById(req.params.id);
    if(!request){
        return next(errorHandler(404, 'request not found'));
    }

    try {
        const updatedRequest = await Request.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        res.status(200).json(updatedRequest)
    } catch (error) {
        next(error);
    }
}







//const {listingId, listingName, listingDescription, listingRent, listingDeposit, listingImages, clientId, clientName, clientEmail, sellerId, sellerName, sellerEmail, requestStatus, readStatus} = req.body;
