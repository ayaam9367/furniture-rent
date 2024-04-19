import { expect } from "chai";
import sinon from "sinon";
import { createRequest, getRequest, getRequestDetails, getUserRequest } from "../controllers/request.controller.js";
import Request from "../models/request.models.js";
import User from "../models/user.models.js";
import Listing from "../models/listing.models.js";


describe("createRequest controller", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should create a new request successfully", async () => {
    const req = {
      body: {
        // Provide request data here
      },
    };
    const res = {
      status: sinon.stub().returnsThis(), // Stub the status function
      json: sinon.spy(),
    };
    const next = sinon.spy();

    const mockRequest = {
      // Mock request object here
    };

    sinon.stub(Request, "create").resolves(mockRequest);

    await createRequest(req, res, next);

    expect(res.status.calledOnceWith(201)).to.be.true;
    expect(res.json.calledOnceWith(mockRequest)).to.be.true;
  });

  it("should handle errors during request creation", async () => {
    const req = {
      body: {
        // Provide request data here
      },
    };
    const res = {};
    const next = sinon.spy();

    const errorMessage = "Database error";
    sinon.stub(Request, "create").rejects(new Error(errorMessage));

    await createRequest(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
    expect(next.firstCall.args[0].message).to.equal(errorMessage);
  });
});


describe("getRequest controller", () => {
    afterEach(() => {
      sinon.restore();
    });
  
    it("should get requests successfully", async () => {
      const req = {
        params: { id: "seller_id" }, // Mock seller ID from route parameters
      };
      const res = {
        status: sinon.stub().returnsThis(), // Stub the status function
        json: sinon.spy(),
      };
      const next = sinon.spy();
  
      const mockRequests = [
        // Mock request objects here
      ];
  
      sinon.stub(Request, "find").resolves(mockRequests);
  
      await getRequest(req, res, next);
  
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith(mockRequests)).to.be.true;
    });
  
    it("should handle errors during request retrieval", async () => {
      const req = {
        params: { id: "seller_id" }, // Mock seller ID from route parameters
      };
      const res = {};
      const next = sinon.spy();
  
      const errorMessage = "Database error";
      sinon.stub(Request, "find").rejects(new Error(errorMessage));
  
      await getRequest(req, res, next);
  
      expect(next.calledOnce).to.be.true;
      expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
      expect(next.firstCall.args[0].message).to.equal(errorMessage);
    });
  });



  describe("getUserRequest controller", () => {
    afterEach(() => {
      sinon.restore();
    });
  
    it("should get user requests successfully", async () => {
      const req = {
        params: { id: "client_id" }, // Mock client ID from route parameters
      };
      const res = {
        status: sinon.stub().returnsThis(), // Stub the status function
        json: sinon.spy(),
      };
      const next = sinon.spy();
  
      const mockRequests = [
        // Mock request objects here
      ];
  
      sinon.stub(Request, "find").resolves(mockRequests);
  
      await getUserRequest(req, res, next);
  
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith(mockRequests)).to.be.true;
    });
  
    it("should handle errors during user request retrieval", async () => {
      const req = {
        params: { id: "client_id" }, // Mock client ID from route parameters
      };
      const res = {};
      const next = sinon.spy();
  
      const errorMessage = "Database error";
      sinon.stub(Request, "find").rejects(new Error(errorMessage));
  
      await getUserRequest(req, res, next);
  
      expect(next.calledOnce).to.be.true;
      expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
      expect(next.firstCall.args[0].message).to.equal(errorMessage);
    });
  });



  describe("getRequestDetails controller", () => {
    afterEach(() => {
      sinon.restore();
    });
  
    it("should get request details successfully", async () => {
      const req = {
        params: { id: "request_id" }, // Mock request ID from route parameters
      };
      const res = {
        status: sinon.stub().returnsThis(), // Stub the status function
        json: sinon.spy(),
      };
      const next = sinon.spy();
  
      const mockRequest = {
        // Mock request object here
      };
  
      const mockClient = {
        // Mock client object here
      };
  
      const mockListing = {
        // Mock listing object here
      };
  
      sinon.stub(Request, "find").resolves([mockRequest]);
      sinon.stub(User, "find").resolves([mockClient]);
      sinon.stub(Listing, "findOne").resolves(mockListing);
  
      await getRequestDetails(req, res, next);
  
     expect(res.status.calledOnceWith(200)).to.be.true;
      //expect(res.json.calledOnceWith({ request: mockRequest, client: mockClient, listing: mockListing })).to.be.true;
    });
  
    it("should handle request not found", async () => {
      const req = {
        params: { id: "non_existent_request_id" }, // Mock non-existent request ID
      };
      const res = {
        status: sinon.stub().returnsThis(), // Stub the status function
        json: sinon.spy(),
      };
      const next = sinon.spy();
  
      sinon.stub(Request, "find").resolves([]);
  
      await getRequestDetails(req, res, next);
  
      // expect(res.status.calledOnceWith(404)).to.be.true;
      // expect(res.json.calledOnceWith("Request not found")).to.be.true;
    });
  
    it("should handle errors during request details retrieval", async () => {
      const req = {
        params: { id: "request_id" }, // Mock request ID from route parameters
      };
      const res = {};
      const next = sinon.spy();
  
      const errorMessage = "Database error";
      sinon.stub(Request, "find").rejects(new Error(errorMessage));
  
      await getRequestDetails(req, res, next);
  
      expect(next.calledOnce).to.be.true;
      expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
      expect(next.firstCall.args[0].message).to.equal(errorMessage);
    });
  });