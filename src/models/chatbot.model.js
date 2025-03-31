import mongoose from "mongoose";
import User from "./user.model.js";

const chatbotSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    messages: [
      {
        role: { type: String, enum: ["user", "bot"], required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
      }
    ]
  });
  
  const Chatbot = mongoose.model("Chatbot", chatbotSchema);

  export default Chatbot;
  