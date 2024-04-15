import express from 'express';
import { createRequest, getRequest, getRequestDetails, getUserRequest, updateRequest } from '../controllers/request.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post("/create-request", createRequest);
router.get("/get-request/:id", verifyToken,  getRequest);
router.get("/get-userRequest/:id", verifyToken, getUserRequest);
router.get("/get-requestDetails/:id", verifyToken, getRequestDetails);
router.post("/update-request/:id", verifyToken, updateRequest);

export default router; 