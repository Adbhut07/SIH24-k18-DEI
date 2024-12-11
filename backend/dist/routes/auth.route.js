"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth/auth.controller");
// import { requestOTP, verifyOTP } from "../controllers/auth/otp.cotroller";
const router = express_1.default.Router();
// Public routes
router.post("/signup", auth_controller_1.signup);
router.post("/signin", auth_controller_1.signin);
// router.post("/auth/request-otp", requestOTP);
// router.post("/auth/verify-otp", verifyOTP);
exports.default = router;
