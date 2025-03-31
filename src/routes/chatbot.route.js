import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { chatWithBot, getChatHistory } from "../controllers/chatbot.controller.js";

const router = express.Router();

router.get("/history", protectRoute, getChatHistory)
router.post("/", protectRoute, chatWithBot )







export default router;