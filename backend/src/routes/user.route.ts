import express, { Router } from 'express';
import { createUser, updateUser, deleteUser, getAllUsers, getUserByEmail, getUserById } from '../controllers/user/user.controller';
import { protect, authorize } from '../utils/auth.middleware';

const router: Router = express.Router();

router.post('/createUser', createUser);
router.put('/:id', protect, authorize(['ADMIN']), updateUser);
router.delete('/:id', protect, authorize(['ADMIN']), deleteUser);
router.get('/getAllUsers', protect, authorize(['ADMIN','INTERVIEWER']), getAllUsers);
router.get('/getUserByEmail', protect, authorize(['ADMIN']), getUserByEmail);
router.get('/getUserById/:id', getUserById);

export default router;
