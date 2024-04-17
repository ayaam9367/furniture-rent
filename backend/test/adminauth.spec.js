import { expect } from "chai";
import sinon from "sinon";
import Adminuser from "../models/adminuser.models.js";
import bcryptjs from "bcryptjs";
import {errorHandler} from '../utils/error.js';
import jwt from "jsonwebtoken";
import {signup, signin, signOut} from "../controllers/adminauth.controller.js"


describe("signup controller", () => {
    afterEach(() => {
      sinon.restore();
    });
  
    it("should create a new admin user successfully", async () => {
      const req = {
        body: {
          username: "test_user",
          email: "test@example.com",
          password: "testpassword"
        }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
      const next = sinon.spy();
  
      const newUser = { _id: "user_id", username: "test_user", email: "test@example.com" };
      sinon.stub(Adminuser.prototype, "save").resolves(newUser);
  
      await signup(req, res, next);
  
      expect(Adminuser.prototype.save.calledOnce).to.be.true;
      expect(res.status.calledOnceWith(201)).to.be.true;
      expect(res.json.calledOnceWith("Admin user created succesfully!")).to.be.true;
    });
  
    it("should handle errors during admin user creation", async () => {
      const req = {
        body: {
          username: "test_user",
          email: "test@example.com",
          password: "testpassword"
        }
      };
      const res = {};
      const next = sinon.spy();
  
      const errorMessage = "Database error";
      sinon.stub(Adminuser.prototype, "save").rejects(new Error(errorMessage));
  
      await signup(req, res, next);
  
      expect(next.calledOnce).to.be.true;
      expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
      expect(next.firstCall.args[0].message).to.equal(errorMessage);
    });
  });



describe("signin controller", () => {
    afterEach(() => {
      sinon.restore();
    });
  
    it("should sign in an admin user successfully with valid credentials", async () => {
      const req = {
        body: {
          email: "test@example.com",
          password: "testpassword"
        }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
        cookie: sinon.spy()
      };
      const next = sinon.spy();
    
      const userFromDatabase = { _id: "user_id", email: "test@example.com", password: "$2a$10$SsJKB5NvXm..bJZW0CFDhewvzF3uRb6dctvz7o4RXzUs./A.Izy7C" };
      sinon.stub(Adminuser, "findOne").resolves(userFromDatabase);
    
      await signin(req, res, next);
    
      console.log('res.json called:', res.json.calledOnce);
      expect(res.json.calledOnce).to.be.true;
      expect(res.status.calledOnceWith(200)).to.be.true;
      // Add this line to debug
      expect(res.cookie.calledOnceWith("access_token", sinon.match.string, { httpOnly: false, maxAge: 12096000000, sameSite: 'none', secure: false })).to.be.true;
    });
    
  
    it("should return 404 error if admin user is not found", async () => {
      const req = {
        body: {
          email: "nonexistent@example.com",
          password: "testpassword"
        }
      };
      const res = {};
      const next = sinon.spy();
  
      sinon.stub(Adminuser, "findOne").resolves(null); // Stubbing AdminUser.findOne to resolve with null
  
      await signin(req, res, next);
  
      expect(next.calledOnce).to.be.true; // Ensure that next is called
      expect(next.calledWith(sinon.match({ statusCode: 404, message: "User not found!" }))).to.be.true; // Ensure that next is called with the correct error object
    });
  
    it("should return 401 error if password is incorrect", async () => {
      const req = {
        body: {
          email: "test@example.com",
          password: "wrongpassword"
        }
      };
      const res = {};
      const next = sinon.spy();
  
      const userFromDatabase = { _id: "user_id", email: "test@example.com", password: "$2a$10$SsJKB5NvXm..bJZW0CFDhewvzF3uRb6dctvz7o4RXzUs./A.Izy7C" }; // Example user from the database with hashed password
  
      sinon.stub(Adminuser, "findOne").resolves(userFromDatabase); // Stubbing AdminUser.findOne to resolve with userFromDatabase
  
      await signin(req, res, next);
  
      expect(next.calledOnce).to.be.true; // Ensure that next is called
      expect(next.calledWith(sinon.match({ statusCode: 401, message: "Wrong credentials!" }))).to.be.true; // Ensure that next is called with the correct error object
    });
  });



  describe("signOut controller", () => {
    afterEach(() => {
      sinon.restore();
    });
  
    it("should sign out the user successfully when authorization header is provided", async () => {
      const req = {
        headers: {
          authorization: "Bearer test_token"
        }
      };
      const res = {
        json: sinon.spy()
      };
      const next = sinon.spy();
  
      await signOut(req, res, next);
  
      expect(res.json.calledOnceWith({ message: "User has been signed out!" })).to.be.true; // Ensure that the response JSON is correct
    });
  
    it("should return 401 error when authorization header is missing", async () => {
      const req = {
        headers: {}
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
      const next = sinon.spy();
  
      await signOut(req, res, next);
  
      expect(res.status.calledOnceWith(401)).to.be.true; // Ensure that the status is 401
      expect(res.json.calledOnceWith({ message: "Authorization header missing" })).to.be.true; // Ensure that the response JSON is correct
    });
  });