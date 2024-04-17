import Listing from "../models/listing.models.js";
import { errorHandler } from "../utils/error.js";

export const createListing  = async(req, res, next) => {
    try {
        const listing =  await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error);
    }    
};
   
 export const deleteListing = async(req, res, next) => {
  console.log("Inside delete listing controller");
    const listing = await Listing.findById(req.params.id);

    if(!listing){
        return next(errorHandler(404, "Listing not found"));
    }
if(req.user.id !== listing.userRef){
         return next(errorHandler(401,"you can delete your own listings only"));
     }
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json("listing deleted successfully");
    } catch (error) {
        next(error);
    }
 };  

 export const updateListing = async (req, res, next) => {
  console.log('Inside UpdateListing controller');
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    // if (req.user.id !== listing.userRef) {
    //   return next(errorHandler(401, 'You cannot update!'));
    // }
  
    try {
      console.log("123")
      const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json(updatedListing);
    } catch (error) {
      next(error);
    }
  };

  export const getListing = async (req, res, next) => {
    try {
      const listing = await Listing.findById(req.params.id);
      if (!listing) {
        return res.status(404).json({ success: false, message: 'Listing not found!' });
      }
      res.status(200).json(listing);
    } catch (error) {
      next(error);
    }  
};


export const getListings = async(req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

      // sevendaysfreetrial, freerelocation, maintenance, freeupgrade

    let sevendaysfreetrial = req.query.sevendaysfreetrial;

    if(sevendaysfreetrial === undefined || sevendaysfreetrial === 'false'){
      sevendaysfreetrial = {$in: [false, true]};
    }

    let freerelocation = req.query.freerelocation;

    if(freerelocation === undefined || freerelocation === 'false'){
      freerelocation = {$in: [false, true]};
    }

    let maintenance = req.query.maintenance;

    if(maintenance === undefined || maintenance === 'false'){
      maintenance = {$in: [false, true]};
    }

    let freeupgrade = req.query.freeupgrade;

    if(freeupgrade === undefined || freeupgrade === 'false'){
      freeupgrade = {$in: [false, true]};
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      sevendaysfreetrial,
      freerelocation,
      maintenance,
      freeupgrade,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
}
    
    