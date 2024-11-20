import express, { Router } from 'express';
import { createUser, updateUser, deleteUser } from '../controllers/user.controller';
import { protect, authorize } from '../utils/auth.middleware';

const router: Router = express.Router();

router.post('/createUser', protect, authorize(['ADMIN']), createUser);
router.put('/:id', protect, authorize(['ADMIN']), updateUser);
router.delete('/:id', protect, authorize(['ADMIN']), deleteUser);

export default router;
