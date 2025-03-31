import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { blockWebsite, boostWebsite, getWebsitePreferences, unblockWebsite, unboostWebsite } from "../controllers/websitePreference.controller.js";

const router = express.Router();

router.get("/", protectRoute, getWebsitePreferences );
router.post("/boosted", protectRoute, boostWebsite  );
router.post("/blocked", protectRoute, blockWebsite  );
router.delete("/unblock", protectRoute, unblockWebsite);
router.delete("/unboost", protectRoute, unboostWebsite );





export default router;