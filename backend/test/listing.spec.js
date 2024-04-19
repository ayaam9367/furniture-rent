import { expect } from "chai";
import chai from 'chai';
import sinon from "sinon";
import Listing from "../models/listing.models.js";
import { errorHandler } from "../utils/error.js";
import chaiHttp from "chai-http";
import app from '../index.js'
import { createListing, deleteListing, updateListing, getListing, getListings} from "../controllers/listing.controller.js";

chai.use(chaiHttp);
const mockedListingId = "66093a62bb4b6781a41472c0"

describe("createListing controller", () => {
  afterEach(() => {
    sinon.restore();
  });
  it("should create a new listing",  async() => {
    sinon.stub(Listing, "create").resolves({});
      //sinon.stub(Inventory.prototype, "save").resolves(mockedItem4);
 
      const res = await chai
        .request(app)
        .post("/backend/listing/create")
    //    .set("Authorization", "Bearer mocktoken")
        .send({});

        expect(res).to.have.status(201);
  });
});

describe("updateListing controller", () => {
  afterEach(() => {
    sinon.restore();
  });
  it("should update a new listing",  async() => {
    sinon.stub(Listing, "findById").resolves({});
      //sinon.stub(Inventory.prototype, "save").resolves(mockedItem4);
 
      sinon.stub(Listing, "findByIdAndUpdate").resolves({});

      const res = await chai
        .request(app)
        .post(`/backend/listing/update/${mockedListingId}`)
    //    .set("Authorization", "Bearer mocktoken")
        .send({});

       
  });
});


describe("createListing controller", () => {
    afterEach(() => {
      sinon.restore();
    });
  
    it("should create a new listing successfully", async () => {
      const req = {
        body: {
          title: "Test Listing",
          description: "This is a test listing.",
          price: 100,
          
        },
      };
      const res = {
        status: sinon.stub().returnsThis(), // Stub the status function
        json: sinon.spy(),
      };
      const next = sinon.spy();
  
      const mockListing = {
        _id: "listing_id",
        title: "Test Listing",
        description: "This is a test listing.",
        price: 100,
        
      };
  
      sinon.stub(Listing, "create").resolves(mockListing); // Stubbing Listing.create to resolve with mock data
  
      await createListing(req, res, next);
  
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith(mockListing)).to.be.true;
    });
  
    it("should handle errors during listing creation", async () => {
      const req = {
        body: {
          // Provide incomplete or invalid data to trigger an error
        },
      };
      const res = {};
      const next = sinon.spy();
  
      sinon.stub(Listing, "create").rejects(new Error("Database error")); // Stubbing Listing.create to reject with an error
  
      await createListing(req, res, next);
  
      expect(next.calledOnce).to.be.true;
      expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
    });
  });


  describe("deleteListing controller", () => {
    afterEach(() => {
      sinon.restore();
    });
  
    it("should delete a listing successfully", async () => {
      const req = {
        user: { id: "user_id" }, // Mock user ID from authentication middleware
        params: { id: "listing_id" }, // Mock listing ID from route parameters
      };
      const res = {
        status: sinon.stub().returnsThis(), // Stub the status function
        json: sinon.spy(),
      };
      const next = sinon.spy();
  
      const mockListing = {
        _id: "listing_id",
        userRef: "user_id",
  
      };
  
      sinon.stub(Listing, "findById").resolves(mockListing); // Stubbing Listing.findById to resolve with mock data
      sinon.stub(Listing, "findByIdAndDelete").resolves(); // Stubbing Listing.findByIdAndDelete to resolve
  
      await deleteListing(req, res, next);
  
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith("listing deleted successfully")).to.be.true;
    });
  
    it("should handle error when listing is not found", async () => {
      const req = {
        user: { id: "user_id" }, // Mock user ID from authentication middleware
        params: { id: "listing_id" }, // Mock listing ID from route parameters
      };
      const res = {};
      const next = sinon.spy();
  
      sinon.stub(Listing, "findById").resolves(null); // Stubbing Listing.findById to resolve with null
  
      await deleteListing(req, res, next);
  
      expect(next.calledOnce).to.be.true;
      expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
    });
  
    it("should handle error when user does not own the listing", async () => {
      const req = {
        user: { id: "user_id" }, // Mock user ID from authentication middleware
        params: { id: "listing_id" }, // Mock listing ID from route parameters
      };
      const res = {};
      const next = sinon.spy();
  
      const mockListing = {
        _id: "listing_id",
        userRef: "another_user_id", // Mock another user ID as the owner of the listing
  
      };
  
      sinon.stub(Listing, "findById").resolves(mockListing); // Stubbing Listing.findById to resolve with mock data
  
      await deleteListing(req, res, next);
  
      expect(next.calledOnce).to.be.true;
      expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
    });
  
    it("should handle errors during listing deletion", async () => {
      const req = {
        user: { id: "user_id" }, // Mock user ID from authentication middleware
        params: { id: "listing_id" }, // Mock listing ID from route parameters
      };
      const res = {};
      const next = sinon.spy();
  
      const mockListing = {
        _id: "listing_id",
        userRef: "user_id",
  
      };
  
      sinon.stub(Listing, "findById").resolves(mockListing); // Stubbing Listing.findById to resolve with mock data
      sinon.stub(Listing, "findByIdAndDelete").rejects(new Error("Database error")); // Stubbing Listing.findByIdAndDelete to reject with an error
  
      await deleteListing(req, res, next);
  
      expect(next.calledOnce).to.be.true;
      expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
    });
  });
  

  describe("updateListing controller", () => {
    afterEach(() => {
      sinon.restore();
    });
  
    it("should update a listing successfully", async () => {
      const req = {
        params: { id: "listing_id" }, // Mock listing ID from route parameters
        body: {
          // Mock updated listing data
          title: "Updated Title",
          description: "Updated Description",
    
        },
      };
      const res = {
        status: sinon.stub().returnsThis(), // Stub the status function
        json: sinon.spy(),
      };
      const next = sinon.spy();
  
      const mockListing = {
        _id: "listing_id",
        // Mock original listing data
        title: "Original Title",
        description: "Original Description",
  
      };
  
      sinon.stub(Listing, "findById").resolves(mockListing); // Stubbing Listing.findById to resolve with mock data
      sinon.stub(Listing, "findByIdAndUpdate").resolves(mockListing); // Stubbing Listing.findByIdAndUpdate to resolve with mock data
  
      await updateListing(req, res, next);
  
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith(mockListing)).to.be.true;
    });
  
    it("should handle error when listing is not found", async () => {
      const req = {
        params: { id: "listing_id" }, // Mock listing ID from route parameters
        body: {
          // Mock updated listing data
          title: "Updated Title",
          description: "Updated Description",
    
        },
      };
      const res = {};
      const next = sinon.spy();
  
      sinon.stub(Listing, "findById").resolves(null); // Stubbing Listing.findById to resolve with null
  
      await updateListing(req, res, next);
  
      expect(next.calledOnce).to.be.true;
      expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
    });
  
    it("should handle errors during listing update", async () => {
      const req = {
        params: { id: "listing_id" }, // Mock listing ID from route parameters
        body: {
          // Mock updated listing data
          title: "Updated Title",
          description: "Updated Description",
    
        },
      };
      const res = {};
      const next = sinon.spy();
  
      const mockListing = {
        _id: "listing_id",
        // Mock original listing data
        title: "Original Title",
        description: "Original Description",
  
      };
  
      sinon.stub(Listing, "findById").resolves(mockListing); // Stubbing Listing.findById to resolve with mock data
      sinon.stub(Listing, "findByIdAndUpdate").rejects(new Error("Database error")); // Stubbing Listing.findByIdAndUpdate to reject with an error
  
      await updateListing(req, res, next);
  
      expect(next.calledOnce).to.be.true;
      expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
    });
  });



  describe("getListing controller", () => {
    afterEach(() => {
      sinon.restore();
    });
  
    it("should return the listing when found", async () => {
      const req = {
        params: { id: "listing_id" }, // Mock listing ID from route parameters
      };
      const res = {
        status: sinon.stub().returnsThis(), // Stub the status function
        json: sinon.spy(),
      };
      const next = sinon.spy();
  
      const mockListing = {
        _id: "listing_id",
        // Mock listing data
        title: "Test Listing",
        description: "Test Description",
  
      };
  
      sinon.stub(Listing, "findById").resolves(mockListing); // Stubbing Listing.findById to resolve with mock data
  
      await getListing(req, res, next);
  
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith(mockListing)).to.be.true;
    });
  
    it("should return a 404 error when listing is not found", async () => {
      const req = {
        params: { id: "listing_id" }, // Mock listing ID from route parameters
      };
      const res = {
        status: sinon.stub().returnsThis(), // Stub the status function
        json: sinon.spy(),
      };
      const next = sinon.spy();
  
      sinon.stub(Listing, "findById").resolves(null); // Stubbing Listing.findById to resolve with null
  
      await getListing(req, res, next);
  
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.calledWith({ success: false, message: 'Listing not found!' })).to.be.true;
    });
  
    it("should handle errors during listing retrieval", async () => {
      const req = {
        params: { id: "listing_id" }, // Mock listing ID from route parameters
      };
      const res = {};
      const next = sinon.spy();
  
      sinon.stub(Listing, "findById").rejects(new Error("Database error")); // Stubbing Listing.findById to reject with an error
  
      await getListing(req, res, next);
  
      expect(next.calledOnce).to.be.true;
      expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
    });
  });


  describe("getListings controller", () => {
    afterEach(() => {
      sinon.restore();
    });
  
    it("should return a list of listings based on query parameters", async () => {
      const req = {
        query: {
          limit: 5,
          startIndex: 0,
          searchTerm: "apartment",
          sort: "createdAt",
          order: "desc",
          sevendaysfreetrial: false,
          freerelocation: true,
          maintenance: true,
          freeupgrade: false,
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
      const next = sinon.spy();
  
      const mockListings = [
        { name: "Apartment 1", sevendaysfreetrial: false, freerelocation: true, maintenance: true, freeupgrade: false },
        { name: "Apartment 2", sevendaysfreetrial: false, freerelocation: true, maintenance: true, freeupgrade: false },
        { name: "Apartment 3", sevendaysfreetrial: false, freerelocation: true, maintenance: true, freeupgrade: false },
      ];
  
      sinon.stub(Listing, "find").resolves(mockListings);
  
      await getListings(req, res, next);
  
     
    });
  
    it("should handle errors when fetching listings", async () => {
      const req = {
        query: {},
      };
      const res = {};
      const next = sinon.spy();
  
      const errorMessage = "Database error";
      sinon.stub(Listing, "find").rejects(new Error(errorMessage));
  
      await getListings(req, res, next);
  
      expect(next.calledOnce).to.be.true;
      expect(next.calledWithMatch(sinon.match.instanceOf(Error))).to.be.true;
    
    });
});