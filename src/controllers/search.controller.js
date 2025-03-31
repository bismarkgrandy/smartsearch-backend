import axios from "axios";
import SearchHistory from "../models/searchHIstory.model.js";
import WebsitePreference from "../models/websitePreference.model.js";
import dotenv from "dotenv";

dotenv.config();

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const GOOGLE_CX = process.env.GOOGLE_SEARCH_SEARCH_ENGINE_ID;



const cleanSummaryText = (text) => {
  return text.replace(/\n/g, " ").trim();
};

export const searchAndSummarize = async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.user._id;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const userPreferencesPromise = WebsitePreference.findOne({ userId });
    const googleSearchPromise = axios.get("https://www.googleapis.com/customsearch/v1", {
      params: { key: GOOGLE_SEARCH_API_KEY, cx: GOOGLE_CX, q: query, num: 10 },
    });

    const [userPreferences, googleResponse] = await Promise.all([
      userPreferencesPromise,
      googleSearchPromise,
    ]);

    const blockedWebsites = userPreferences?.blockedWebsites || [];
    const boostedWebsites = userPreferences?.boostedWebsites || [];

    let searchResults = googleResponse.data.items || [];

    searchResults = searchResults.filter(
      (result) => !blockedWebsites.some((site) => result.link.includes(site))
    );

    searchResults.sort((a, b) => {
      const isABoosted = boostedWebsites.some((site) => a.link.includes(site));
      const isBBoosted = boostedWebsites.some((site) => b.link.includes(site));
      return isBBoosted - isABoosted;
    });

    if (searchResults.length === 0) {
      return res.json({ summary: "No relevant results found.", results: [] });
    }

    const extractedText = searchResults
      .map((result) => `Title: ${result.title}\nSnippet: ${result.snippet}`)
      .join("\n\n");

    const aiResponse = await axios.post(
      CLAUDE_API_URL,
      {
        model: "claude-3-haiku-20240307", 
        max_tokens: 300,
        system: `You are an AI that summarizes search results professionally and naturally. 
        - Extract key insights from the search results below.
        - Do NOT start with "Based on your search" or "Here is a summary".
        - Present the summary in an engaging and informative way.
        - Keep it concise but impactful.`,
        messages: [{ role: "user", content: `Summarize the following search results:\n\n${extractedText}` }],
      },
      {
        headers: {
          "x-api-key": CLAUDE_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
      }
    );

    const aiSummary = cleanSummaryText(
      aiResponse.data?.content?.[0]?.text || "Summary not available."
    );

    // Save search history
    await SearchHistory.create({
      userId,
      query,
      results: searchResults.map((item) => ({
        title: item.title,
        link: item.link,
      })),
    });

    // Send response
    res.json({
      summary: aiSummary,
      results: searchResults.map((item) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
      })),
    });
  } catch (error) {
    console.error("Error in search and summary:", error.response?.data || error.message);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};


export const getSearchHistory = async (req, res) => {
    try {
      const userId = req.user._id;
      const limit = parseInt(req.query.limit) || 10; 
  
      const history = await SearchHistory.find({ userId })
        .sort({ createdAt: -1 }) 
        .limit(limit);
  
      res.json({ history });
    } catch (error) {
      console.error("Error fetching search history:", error);
      res.status(500).json({ error: "An error occurred while retrieving search history." });
    }
  };

  export const deleteSearchHistory = async (req, res) => {
    try {
      const userId = req.user._id;
      const searchId = req.params.id;
  
      const deletedEntry = await SearchHistory.findOneAndDelete({ _id: searchId, userId });
  
      if (!deletedEntry) {
        return res.status(404).json({ error: "Search history entry not found." });
      }
  
      res.json({ message: "Search history entry deleted successfully." });
    } catch (error) {
      console.error("Error deleting search history entry:", error);
      res.status(500).json({ error: "An error occurred while deleting the search history entry." });
    }
  };

  export const clearSearchHistory = async (req, res) => {
    try {
      const userId = req.user._id;
  
      await SearchHistory.deleteMany({ userId });
  
      res.json({ message: "Search history cleared successfully." });
    } catch (error) {
      console.error("Error clearing search history:", error);
      res.status(500).json({ error: "An error occurred while clearing search history." });
    }
  };

  
  
  
  