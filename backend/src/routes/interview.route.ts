import express from "express";
import { createInterviewSession, getAllInterviews, getInterviewById, updateInterviewSession, updateInterviewStatus } from "../controllers/interview/interview.controller";
import { authorize, protect } from "../utils/auth.middleware";

const router = express.Router();

<<<<<<< HEAD
// router.post("/create", protect, authorize(['ADMIN']), createInterviewSession);
// router.patch("/interview-update", protect, authorize(['ADMIN']), updateInterviewSession);
// router.put("/status", updateInterviewStatus);
=======
router.post("/create", protect, authorize(['ADMIN']), createInterviewSession);
router.patch("/interview-update/:id", protect, authorize(['ADMIN']), updateInterviewSession);
router.put("/status/:id", updateInterviewStatus);
router.get("/interviews",protect,authorize(['ADMIN']),getAllInterviews)
router.get("/interviews",protect, getInterviewById)

>>>>>>> d5f654d205b8e800e111a72e1e04f1563e871d6f


export default router;
