import { expect } from "chai";
import sinon from "sinon";
import { updateUser, deleteUser, getUserListings } from "../controllers/adminuser.controller.js";
import Adminuser from "../models/adminuser.models.js";
import Listing from "../models/listing.models.js";
import bcryptjs from "bcryptjs";




describe("updateUser controller", () => {
    afterEach(() => {
      sinon.restore();
    });
  
    it("should update user information successfully", async () => {
      const req = {
        user: { id: "user_id" }, // Mock user ID from authentication middleware
        params: { id: "user_id" }, // Mock user ID from route parameters
        body: {
          username: "new_username",
          email: "new_email@example.com",
          password: "new_password",
          avatar: "new_avatar_url",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(), // Stub the status function
        json: sinon.spy(),
      };
      const next = sinon.spy();
  
      const updatedUser = {
        _id: "user_id",
        username: "new_username",
        email: "new_email@example.com",
        password: "new_hashed_password",
        avatar: "new_avatar_url",
      };
  
      sinon.stub(Adminuser, "findByIdAndUpdate").resolves(updatedUser);
      sinon.stub(bcryptjs, "hashSync").returns("new_hashed_password");
  
      await updateUser(req, res, next);
  
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith({ username: "new_username", email: "new_email@example.com", avatar: "new_avatar_url" })).to.be.true;
    });
  
    it("should handle user unauthorized to update", async () => {
      const req = {
        user: { id: "user_id" }, // Mock user ID from authentication middleware
        params: { id: "another_user_id" }, // Mock another user ID from route parameters
        body: {
          username: "new_username",
          email: "new_email@example.com",
          password: "new_password",
          avatar: "new_avatar_url",
        },
      };
      const res = {};
      const next = sinon.spy();
  
      await updateUser(req, res, next);
  
      expect(next.calledOnce).to.be.true;
      expect(next.calledWith(sinon.match({
        statusCode: 401,
        message: "You can only update your own account!"
      }))).to.be.true;
    });
  
    it("should handle errors during user update", async () => {
      const req = {
        user: { id: "user_id" }, // Mock user ID from authentication middleware
        params: { id: "user_id" }, // Mock user ID from route parameters
        body: {
          username: "new_username",
          email: "new_email@example.com",
          password: "new_password",
          avatar: "new_avatar_url",
        },
      };
      const res = {};
      const next = sinon.spy();
  
      const errorMessage = "Database error";
      sinon.stub(Adminuser, "findByIdAndUpdate").rejects(new Error(errorMessage));
  
      await updateUser(req, res, next);
  
      expect(next.calledOnce).to.be.true;
      expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
      expect(next.firstCall.args[0].message).to.equal(errorMessage);
    });
  });



  describe("deleteUser controller", () => {
    afterEach(() => {
      sinon.restore();
    });
  
    it("should delete user successfully", async () => {
      const req = {
        user: { id: "user_id" }, // Mock user ID from authentication middleware
        params: { id: "user_id" }, // Mock user ID from route parameters
      };
      const res = {
        status: sinon.stub().returnsThis(), // Stub the status function
        json: sinon.spy(),
      };
      const next = sinon.spy();
  
      sinon.stub(Adminuser, "findByIdAndDelete");
  
      await deleteUser(req, res, next);
  
      expect(Adminuser.findByIdAndDelete.calledOnceWith("user_id")).to.be.true;
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith("User has been deleted!")).to.be.true;
    });
  
    it("should handle user unauthorized to delete", async () => {
      const req = {
        user: { id: "user_id" }, // Mock user ID from authentication middleware
        params: { id: "another_user_id" }, // Mock another user ID from route parameters
      };
      const res = {};
      const next = sinon.spy();
  
      await deleteUser(req, res, next);
  
      expect(next.calledOnce).to.be.true;
      expect(next.calledWith(sinon.match({
        statusCode: 401,
        message: "You can only delete your own account!"
      }))).to.be.true;
    });
  
    it("should handle errors during user deletion", async () => {
      const req = {
        user: { id: "user_id" }, // Mock user ID from authentication middleware
        params: { id: "user_id" }, // Mock user ID from route parameters
      };
      const res = {};
      const next = sinon.spy();
  
      const errorMessage = "Database error";
      sinon.stub(Adminuser, "findByIdAndDelete").rejects(new Error(errorMessage));
  
      await deleteUser(req, res, next);
  
      expect(next.calledOnce).to.be.true;
      expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
      expect(next.firstCall.args[0].message).to.equal(errorMessage);
    });
  });




describe("getUserListings controller", () => {
    afterEach(() => {
      sinon.restore();
    });
  
    it("should get user listings successfully", async () => {
      const req = {
        user: { id: "user_id" }, // Mock user ID from authentication middleware
        params: { id: "user_id" }, // Mock user ID from route parameters
      };
      const res = {
        status: sinon.stub().returnsThis(), // Stub the status function
        json: sinon.spy(),
      };
      const next = sinon.spy();
  
      const listings = [{ _id: "listing_id", name: "Listing 1" }, { _id: "listing_id_2", name: "Listing 2" }];
      sinon.stub(Listing, "find").resolves(listings);
  
      await getUserListings(req, res, next);
  
      expect(Listing.find.calledOnceWith({ userRef: "user_id" })).to.be.true;
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith(listings)).to.be.true;
    });
  
    it("should handle user unauthorized to view listings", async () => {
      const req = {
        user: { id: "user_id" }, // Mock user ID from authentication middleware
        params: { id: "another_user_id" }, // Mock another user ID from route parameters
      };
      const res = {};
      const next = sinon.spy();
  
      await getUserListings(req, res, next);
  
      expect(next.calledOnce).to.be.true;
      expect(next.calledWith(sinon.match({
        statusCode: 401,
        message: "You can only view your own listings!"
      }))).to.be.true;
    });
  
    it("should handle errors during fetching user listings", async () => {
      const req = {
        user: { id: "user_id" }, // Mock user ID from authentication middleware
        params: { id: "user_id" }, // Mock user ID from route parameters
      };
      const res = {};
      const next = sinon.spy();
  
      const errorMessage = "Database error";
      sinon.stub(Listing, "find").rejects(new Error(errorMessage));
  
      await getUserListings(req, res, next);
  
      expect(next.calledOnce).to.be.true;
      expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
      expect(next.firstCall.args[0].message).to.equal(errorMessage);
    });
  });