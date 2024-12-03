import express from 'express';
import { createRoom, getRoom, updateRoom, deleteRoom, getRooms } from '../controllers/agoraRoom/agoraRoom.controller';
import { generateToken } from '../controllers/agoraRoom/tokenController';

const router = express.Router();

router.post('/rooms', createRoom);        
router.get('/getRoom/:roomId', getRoom);    
router.get('/rooms', getRooms);
router.put('/rooms/:roomId', updateRoom); 
router.delete('/rooms/:roomId', deleteRoom); 
router.post('/agoraToken', generateToken);

export default router;
