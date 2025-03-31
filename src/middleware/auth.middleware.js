import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async(req, res, next) => {
    try{
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({message:"Unauthorized - no token available"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({message:"Unauthorized - invalid token"});
        }

        const user = await User.findById(decoded.userId).select("-password");

        req.user = user;

        next();

    } catch(error){
        console.error("Error in the protectRoute middleware: ", error.message);
        res.status(500).json({message:"Internal server error"});
    }
}