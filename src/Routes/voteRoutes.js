import { Router } from "express";
import { postVote, showPollResult } from "../Controllers/voteController.js";

const router = Router();

router.post('/poll/:id/vote', postVote);
router.get('/poll/:id/result', showPollResult);

export default router;