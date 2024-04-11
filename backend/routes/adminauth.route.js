import express from 'express';
import { signup, signin, signOut } from '../controllers/adminauth.controller.js';

const router = express.Router();

router.post("/admin-signup", signup);
router.post("/admin-signin", signin);
router.get("/admin-signout", signOut);

export default router;