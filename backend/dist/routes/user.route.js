"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user/user.controller");
const auth_middleware_1 = require("../utils/auth.middleware");
const router = express_1.default.Router();
router.post('/createUser', auth_middleware_1.protect, (0, auth_middleware_1.authorize)(['ADMIN']), user_controller_1.createUser);
router.put('/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)(['ADMIN']), user_controller_1.updateUser);
router.delete('/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)(['ADMIN']), user_controller_1.deleteUser);
router.get('/getAllUsers', auth_middleware_1.protect, (0, auth_middleware_1.authorize)(['ADMIN', 'INTERVIEWER']), user_controller_1.getAllUsers);
router.get('/getUserByEmail', auth_middleware_1.protect, (0, auth_middleware_1.authorize)(['ADMIN']), user_controller_1.getUserByEmail);
router.get('/getUserById/:id', user_controller_1.getUserById);
exports.default = router;
