import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../lib/utils.js";


export const signup = async(req, res)=>{

    const {username, email , password} = req.body;

    try{
        if(!username || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        };

        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters"});
        };

        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({message: "Email already exists"});
        };

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password:hashedPassword
        })

        generateToken(newUser._id, res);

        await newUser.save();

        res.status(201).json({_id:newUser._id, username:newUser.username, email:newUser.email});

    } catch(error){
       console.error("Error in sign up controller: ", error.message);
       res.status(500).json({message:"Internal server error"});
    }
}

export const login = async(req, res)=>{
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email});
        
        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        };

        const isPassword = await bcrypt.compare(password, user.password);

        if(!isPassword){
            return res.status(400).json({message:"Invalid credentials"})
        }

        generateToken(user._id,res);

        res.status(200).json({_id:user._id,username:user.username,email:user.email});

    } catch(error){
        console.error("Error in login route:" , error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export const logout = async(req, res)=>{
    try{
        res.cookie("jwt","" , {maxAge:0});
        res.status(200).json({message:"Logged out succesfully"})

    } catch(error){
        console.error("Error in logout controller: ", error.message )
        res.status(500).json({message:"Internal server error"});
    }
}

export const getUserInfo = async (req, res) => {
    try{
        res.status(200).json(req.user)

    } catch (error){
        console.error("Error in get user info controller: ", error.message);
        res.status(500).json({message:"internal server error"});

    }
}
