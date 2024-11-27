import express from 'express';
import { createCandidateProfile, deleteCandidateProfile, getCandidateProfileByEmail, updateCandidateProfile } from '../controllers/user/userProfile.controller';

const router = express.Router();

router.post('/createCandidateProfile', createCandidateProfile);
router.get('/:email', getCandidateProfileByEmail);
router.put('/:id', updateCandidateProfile);
router.delete('/:id', deleteCandidateProfile);

export default router;