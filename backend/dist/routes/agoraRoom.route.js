"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const agoraRoom_controller_1 = require("../controllers/agoraRoom/agoraRoom.controller");
const tokenController_1 = require("../controllers/agoraRoom/tokenController");
const router = express_1.default.Router();
router.post('/rooms', agoraRoom_controller_1.createRoom);
router.get('/getRoom/:roomId', agoraRoom_controller_1.getRoom);
router.get('/rooms', agoraRoom_controller_1.getRooms);
router.put('/rooms/:roomId', agoraRoom_controller_1.updateRoom);
router.delete('/rooms/:roomId', agoraRoom_controller_1.deleteRoom);
router.post('/agoraToken', tokenController_1.generateToken);
exports.default = router;
