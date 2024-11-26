"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth/auth.controller");
const tokenController_1 = require("../controllers/tokenController");
const router = express_1.default.Router();
// Public routes
router.post("/signup", auth_controller_1.signup);
router.post("/signin", auth_controller_1.signin);
router.get('/generate-token', tokenController_1.generateToken);
exports.default = router;
