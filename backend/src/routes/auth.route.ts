import express from "express";
import { signin, signup } from "../controllers/auth/auth.controller";
import { authorize, protect } from "../utils/auth.middleware";
// import { generateToken } from "../controllers/tokenController";
//import { callAWS } from "../helper/s3";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/signin", signin);
// router.get('/generate-token', generateToken);

export default router;
