import { Router } from "express";
import { postChoice, showPollChoices } from "../Controllers/choiceController.js";

const router = Router();

router.post('/choice', postChoice);
router.get('/poll/:id/choice', showPollChoices);

export default router;