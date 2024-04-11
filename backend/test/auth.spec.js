import request from "supertest";
import app from "../index.js";
import { expect } from "chai";
import sinon from "sinon";
import { signup, signin } from "../controllers/auth.controller.js";
import User from "../models/user.models.js";

describe("Signup Controller", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should create a new user successfully", async () => {
    const req = {
      body: {
        username: "testuser",
        email: "test@example.com",
        password: "testpassword",
      },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    sinon.stub(User.prototype, "save").resolves();

    await signup(req, res);

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith("User created successfully!")).to.be.true;
  });

  it("should handle validation errors", async () => {
    const req = {
      body: {
        email: "test@example.com", // Missing username
        password: "testpassword",
      },
    };
    const res = {
      status: sinon.stub().returnsThis(), // Stub the status function
      json: sinon.spy(),
    };
    const next = sinon.spy();

    await signup(req, res, next);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith(sinon.match({ message: "Validation failed" })))
      .to.be.true;
  });

  it("should handle errors during user creation", async () => {
    const req = {
      body: {
        username: "testuser",
        email: "test@example.com",
        password: "testpassword",
      },
    };
    const res = {
      status: sinon.stub().returnsThis(), // Stub the status function
      json: sinon.spy(),
    };
    const next = sinon.spy();

    sinon.stub(User.prototype, "save").rejects(new Error("Database error"));

    await signup(req, res, next);

    expect(next.called).to.be.true;
    // Check the error passed to next() function
    const errorPassedToNext = next.args[0][0];
    expect(errorPassedToNext).to.be.an("Error");
    expect(errorPassedToNext).to.have.property("statusCode", 500);
    expect(errorPassedToNext)
      .to.have.property("message")
      .that.includes("Internal Server Error");
  });
});

// describe("Signin Controller", () => {
//   afterEach(() => {
//     sinon.restore();
//   });

//   it("should sign in a user successfully with valid credentials", async () => {
//     // Mock request object with user credentials
//     const req = {
//       body: {
//         email: "test@example.com",
//         password: "testpassword",
//       },
//     };
  
//     // Mock response object with spies to track function calls
//     const res = {
//       status: sinon.spy(), // Spy on the status function
//       json: sinon.spy(),   // Spy on the json function
//       cookie: sinon.spy(), // Spy on the cookie function
//     };
  
//     // Mock next function
//     const next = sinon.spy();
  
//     // Example user data retrieved from the database
//     const userFromDatabase = {
//       _id: "user_id",
//       email: "test@example.com",
//       password: "$2a$10$SsJKB5NvXm..bJZW0CFDhewvzF3uRb6dctvz7o4RXzUs./A.Izy7C",
//     };
  
//     // Stub User.findOne method to resolve with example user data
//     sinon.stub(User, "findOne").resolves(userFromDatabase);
  
//     // Execute the signin controller function
//     await signin(req, res, next);
  
//     // Assertions
//     expect(res.status.calledOnce).to.be.true; // Ensure that res.status is called exactly once
//     expect(res.status.firstCall.args[0]).to.equal(200); // Check the status code
//     expect(res.json.calledOnce).to.be.true; // Ensure that res.json is called exactly once
//     expect(
//       res.cookie.calledWith("access_token", sinon.match.string, {
//         httpOnly: false,
//         maxAge: 12096000000,
//         sameSite: "none",
//         secure: false,
//       })
//     ).to.be.true; // Ensure that res.cookie is called with the correct arguments
//   });
  
//   it('should return "User not found!" with 404 status code if user does not exist', async () => {
//     const req = {
//       body: {
//         email: "nonexistent@example.com",
//         password: "testpassword",
//       },
//     };
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.spy(),
//     };
//     const next = sinon.spy();

//     sinon.stub(User, "findOne").resolves(null); // Stubbing User.findOne to resolve with null (user not found)

//     await signin(req, res, next);

//     expect(res.status.calledWith(404)).to.be.true;
//     expect(res.json.calledWith({ message: "User not found!" })).to.be.true;
//   });

//   it('should return "Wrong credentials!" with 401 status code if password is incorrect', async () => {
//     const req = {
//       body: {
//         email: "test@example.com",
//         password: "wrongpassword",
//       },
//     };
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.spy(),
//     };
//     const next = sinon.spy();

//     const userFromDatabase = {
//       _id: "user_id",
//       email: "test@example.com",
//       password: "$2a$10$SsJKB5NvXm..bJZW0CFDhewvzF3uRb6dctvz7o4RXzUs./A.Izy7C",
//     }; // Example user from the database with hashed password

//     sinon.stub(User, "findOne").resolves(userFromDatabase); // Stubbing User.findOne to resolve with userFromDatabase

//     await signin(req, res, next);

//     expect(res.status.calledWith(401)).to.be.true;
//     expect(res.json.calledWith({ message: "Wrong credentials!" })).to.be.true;
//   });

//   it("should handle errors gracefully", async () => {
//     const req = {
//       body: {
//         email: "test@example.com",
//         password: "testpassword",
//       },
//     };
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.spy(),
//     };
//     const next = sinon.spy();

//     sinon.stub(User, "findOne").rejects(new Error("Database error")); // Stubbing User.findOne to reject with an error

//     await signin(req, res, next);

//     expect(next.calledOnce).to.be.true;
//     expect(next.args[0][0])
//       .to.be.an("Error")
//       .with.property("message", "Database error");
//   });
// });
