import { Router } from "express";
import { postPoll, getPoll } from "../Controllers/pollController.js";

const router = Router();

router.post('/poll', postPoll);
router.get('/poll', getPoll);

export default router;