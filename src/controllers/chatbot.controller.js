import axios from "axios";
import Chatbot from "../models/chatbot.model.js";
import dotenv from "dotenv";

dotenv.config();

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;



export const chatWithBot = async (req, res) => {
  try {
    const userId = req.user._id; 
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Message text is required" });

    const userMessage = { role: "user", text, timestamp: new Date() };
    await Chatbot.findOneAndUpdate(
      { userId },
      { $push: { messages: userMessage } },
      { upsert: true, new: true }
    );

    const aiResponse = await axios.post(
      CLAUDE_API_URL,
      {
        model: "claude-3-haiku-20240307",
        max_tokens: 300,
        system: "Respond to user queries in a friendly and informative manner. Keep your responses brief and to the point, no more than 2-3 short sentences when possible. Avoid detailed explanations unless specifically requested.",
        messages: [{ role: "user", content: text }]
      },
      {
        headers: {
          "x-api-key": CLAUDE_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json"
        }
      }
    );

    const botReply = aiResponse.data?.content?.[0]?.text || "Sorry, I couldn't generate a response.";

    const botMessage = { role: "bot", text: botReply, timestamp: new Date() };
    await Chatbot.findOneAndUpdate(
      { userId },
      { $push: { messages: botMessage } }
    );

    res.json({ reply: botReply });

  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ error: "An error occurred while processing your message." });
  }
};

export const getChatHistory = async (req, res) => {
    try {
      const userId = req.user._id; 
  
      const chat = await Chatbot.findOne({ userId });
  
      if (!chat) return res.json({ messages: [] });
  
      res.json({ messages: chat.messages });
  
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  };
  
