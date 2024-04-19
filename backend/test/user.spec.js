import { expect } from "chai";
import sinon from "sinon";
import { updateUser, deleteUser, getUserListings, getUser } from "../controllers/user.controller.js";
import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import Listing from "../models/listing.models.js";

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
      json: sinon.spy(), // Spy on the json function
    };
    const next = sinon.spy(); // Spy on the next function

    const updatedUser = {
      _id: "user_id",
      username: "new_username",
      email: "new_email@example.com",
      password: "new_hashed_password",
      avatar: "new_avatar_url",
    };

    sinon.stub(User, "findByIdAndUpdate").resolves(updatedUser); // Stub the findByIdAndUpdate function of the User model
    sinon.stub(bcryptjs, "hashSync").returns("new_hashed_password"); // Stub the hashSync function of bcryptjs

    await updateUser(req, res, next); // Call the updateUser function with mocked request, response, and next objects

   
  });

  it("should return 401 error if user tries to update another user's account", async () => {
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
    expect(
      next.calledWith(
        sinon.match({
          statusCode: 401,
          message: "You can only update your own account!",
        })
      )
    ).to.be.true;
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

    sinon.stub(User, "findByIdAndUpdate").rejects(new Error("Database error"));

    await updateUser(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
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
        status: sinon.spy(),
        json: sinon.spy(),
      };
      const next = sinon.spy();
  
      sinon.stub(User, "findByIdAndDelete").resolves(); // Stubbing User.findByIdAndDelete to resolve
  
      await deleteUser(req, res, next);
  
   
    });
  
    it("should return 401 error if user tries to delete another user's account", async () => {
      const req = {
        user: { id: "user_id" }, // Mock user ID from authentication middleware
        params: { id: "another_user_id" }, // Mock another user ID from route parameters
      };
      const res = {};
      const next = sinon.spy();
  
      await deleteUser(req, res, next);
  
      expect(next.calledOnce).to.be.true;
      expect(
        next.calledWith(
          sinon.match({
            statusCode: 401,
            message: "You can only delete your own account!",
          })
        )
      ).to.be.true;
    });
  
    it("should handle errors during user deletion", async () => {
      const req = {
        user: { id: "user_id" }, // Mock user ID from authentication middleware
        params: { id: "user_id" }, // Mock user ID from route parameters
      };
      const res = {};
      const next = sinon.spy();
  
      sinon.stub(User, "findByIdAndDelete").rejects(new Error("Database error"));
  
      await deleteUser(req, res, next);
  
      expect(next.calledOnce).to.be.true;
      expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
    });
  });


  describe("getUserListings controller", () => {
    afterEach(() => {
      sinon.restore();
    });
  
    it("should return user listings successfully", async () => {
      const req = {
        user: { id: "user_id" }, // Mock user ID from authentication middleware
        params: { id: "user_id" }, // Mock user ID from route parameters
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      const next = sinon.spy();
  
      const mockListings = [
        { title: "Listing 1", description: "Description 1" },
        { title: "Listing 2", description: "Description 2" },
      ];
  
      sinon.stub(Listing, "find").resolves(mockListings); // Stubbing Listing.find to resolve with mock data
  
      await getUserListings(req, res, next);
  
      
    });
  
    it("should return 401 error if user tries to view another user's listings", async () => {
      const req = {
        user: { id: "user_id" }, // Mock user ID from authentication middleware
        params: { id: "another_user_id" }, // Mock another user ID from route parameters
      };
      const res = {};
      const next = sinon.spy();
  
      await getUserListings(req, res, next);
  
      expect(next.calledOnce).to.be.true;
      expect(
        next.calledWith(
          sinon.match({
            statusCode: 401,
            message: "You can only view your own listings!",
          })
        )
      ).to.be.true;
    });
  
    it("should handle errors during listing retrieval", async () => {
      const req = {
        user: { id: "user_id" }, // Mock user ID from authentication middleware
        params: { id: "user_id" }, // Mock user ID from route parameters
      };
      const res = {};
      const next = sinon.spy();
  
      sinon.stub(Listing, "find").rejects(new Error("Database error")); // Stubbing Listing.find to reject with an error
  
      await getUserListings(req, res, next);
  
      expect(next.calledOnce).to.be.true;
      expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
    });
  });


  describe("getUser controller", () => {
    afterEach(() => {
      sinon.restore();
    });
  
    it("should return user information successfully", async () => {
      const req = {
        params: { id: "user_id" }, // Mock user ID from route parameters
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      const next = sinon.spy();
  
      const mockUser = {
        _id: "user_id",
        username: "test_user",
        email: "test@example.com",
      };
  
      sinon.stub(User, "findById").resolves(mockUser); // Stubbing User.findById to resolve with mock data
  
      await getUser(req, res, next);
  
      
    });
  
    it("should return 404 error if user is not found", async () => {
      const req = {
        params: { id: "non_existent_user_id" }, // Mock non-existent user ID from route parameters
      };
      const res = {};
      const next = sinon.spy();
  
      sinon.stub(User, "findById").resolves(null); // Stubbing User.findById to resolve with null
  
      await getUser(req, res, next);
  
      expect(next.calledOnce).to.be.true;
      expect(
        next.calledWith(
          sinon.match({
            statusCode: 404,
            message: "User not found!",
          })
        )
      ).to.be.true;
    });
  
    it("should handle errors during user retrieval", async () => {
      const req = {
        params: { id: "user_id" }, // Mock user ID from route parameters
      };
      const res = {};
      const next = sinon.spy();
  
      sinon.stub(User, "findById").rejects(new Error("Database error")); // Stubbing User.findById to reject with an error
  
      await getUser(req, res, next);
  
      expect(next.calledOnce).to.be.true;
      expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
    });
  });


  