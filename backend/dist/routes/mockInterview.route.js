"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mockInterview_controller_1 = require("../controllers/mockInterview/mockInterview.controller");
const router = express_1.default.Router();
router.post("/create", mockInterview_controller_1.createMockInterview);
router.get("/getAll", mockInterview_controller_1.getAllMockInterviews);
router.get("/get/:id", mockInterview_controller_1.getMockInterviewById);
router.delete("/delete/:id", mockInterview_controller_1.deleteMockInterview);
router.get('/getAllTitles', mockInterview_controller_1.getAllMockInterviewsTitle);
exports.default = router;
