import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { clearSearchHistory, deleteSearchHistory, getSearchHistory, searchAndSummarize } from "../controllers/search.controller.js";

const router = express.Router();

router.get("/search",protectRoute, searchAndSummarize);
router.get("/history", protectRoute, getSearchHistory);
router.delete("/history/clear", protectRoute, clearSearchHistory);
router.delete("/history/:id", protectRoute, deleteSearchHistory);



export default router;