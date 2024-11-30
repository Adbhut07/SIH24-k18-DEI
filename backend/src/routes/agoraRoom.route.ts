import express from 'express';
import { createRoom, getRoom, updateRoom, deleteRoom, getRooms } from '../controllers/agoraRoom/agoraRoom.controller';
import { generateToken } from '../controllers/agoraRoom/tokenController';

const router = express.Router();

router.post('/rooms', createRoom);        
router.get('/getRoom/:appId', getRoom);    
router.get('/rooms', getRooms);
router.put('/rooms/:appId', updateRoom); 
router.delete('/rooms/:appId', deleteRoom); 
router.get('/agoraToken', generateToken);

export default router;
