import express from "express";
import { signin, signup } from "../controllers/auth/auth.controller";
import { authorize, protect } from "../utils/auth.middleware";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/signin", signin);

export default router;
