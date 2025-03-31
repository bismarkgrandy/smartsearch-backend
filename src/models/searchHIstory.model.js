import mongoose from "mongoose";
import User from "./user.model.js";

const searchHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  query: { type: String, required: true },
  results: [{ title: String, link: String }], 
  createdAt: { type: Date, default: Date.now }
});

const SearchHistory = mongoose.model("SearchHistory", searchHistorySchema);

export default SearchHistory;
