import express from "express";
import { signin, signup } from "../controllers/auth/auth.controller";
import { authorize, protect } from "../utils/auth.middleware";
// import { requestOTP, verifyOTP } from "../controllers/auth/otp.cotroller";


const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/signin", signin);
// router.post("/auth/request-otp", requestOTP);
// router.post("/auth/verify-otp", verifyOTP);

export default router;
