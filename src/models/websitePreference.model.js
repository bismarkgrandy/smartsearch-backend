import mongoose from "mongoose";
import User from "./user.model.js";

const websitePreferenceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    boostedWebsites: [{ type: String }], 
    blockedWebsites: [{ type: String }]
  });
  
  const WebsitePreference = mongoose.model("WebsitePreference", websitePreferenceSchema);

  export default WebsitePreference;