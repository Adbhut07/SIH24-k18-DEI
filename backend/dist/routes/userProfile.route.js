"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userProfile_controller_1 = require("../controllers/user/userProfile.controller");
const router = express_1.default.Router();
router.post('/createCandidateProfile', userProfile_controller_1.createCandidateProfile);
router.get('/:email', userProfile_controller_1.getCandidateProfileByEmail);
router.put('/:id', userProfile_controller_1.updateCandidateProfile);
router.delete('/:id', userProfile_controller_1.deleteCandidateProfile);
exports.default = router;
