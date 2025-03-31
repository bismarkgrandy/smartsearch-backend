import express from "express"; 
import dotenv from "dotenv";
import {connectDB} from "./lib/db.js"
import authRoutes from "./routes/auth.route.js";
import searchRoutes from "./routes/search.route.js";
import websitePreferenceRoutes from "./routes/websitePreference.route.js";
import chatbotRoutes from "./routes/chatbot.route.js";

import cors from "cors";


import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const PORT=process.env.PORT;

app.use(express.json());
app.use(cookieParser());
// app.use(cors({
//     origin: "http://localhost:5173",
//     credentials: true
// }))
app.use(
    cors({
      origin: ["https://smartsearch.onrender.com"], // Allow frontend URL
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Include PATCH here
      credentials: true, // Allow cookies and authentication headers
    })
  );


app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/website-preference", websitePreferenceRoutes);
app.use("/api/chat", chatbotRoutes);


app.listen(PORT || 5001, ()=>{
    console.log("The server just started on port : ", PORT);
    connectDB();
})