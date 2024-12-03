"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const interview_controller_1 = require("../controllers/interview/interview.controller");
const auth_middleware_1 = require("../utils/auth.middleware");
const router = express_1.default.Router();
router.post("/create", auth_middleware_1.protect, (0, auth_middleware_1.authorize)(['ADMIN']), interview_controller_1.createInterviewSession);
router.patch("/interview-update/:id", auth_middleware_1.protect, (0, auth_middleware_1.authorize)(['ADMIN']), interview_controller_1.updateInterviewSession);
router.put("/status/:id", interview_controller_1.updateInterviewStatus);
router.get("/interviews", auth_middleware_1.protect, (0, auth_middleware_1.authorize)(['ADMIN']), interview_controller_1.getAllInterviews);
exports.default = router;
