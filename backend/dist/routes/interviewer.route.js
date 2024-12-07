"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const interviewer_controller_1 = require("../controllers/interviewer/interviewer.controller");
const auth_middleware_1 = require("../utils/auth.middleware");
const router = express_1.default.Router();
router.get("/getInterviews/:interviewerId", auth_middleware_1.protect, (0, auth_middleware_1.authorize)(["INTERVIEWER"]), interviewer_controller_1.getInterviewsByInterviewerId);
exports.default = router;
