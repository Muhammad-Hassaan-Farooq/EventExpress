
const Users = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUp = async (req,res) =>{
    try {
        const {email,password} = req.body;
        let user = await Users.findOne({email});

        if (user) {
            return res.status(400).json({message: "User already exists"});
        }
        if (password.length < 8) {
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }

        await Users.create({...req.body, password: await bcrypt.hash(password, 5)});
        return res.status(201).json({message: "User created"});
    } catch (error) {
        res.status(500).json({message: "An error occurred while signing up"});
    }
} 


const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await Users.findOne({email});
        if (!user) return res.status(400).json({message: "User not found"});

        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) return res.status(400).json({message: "Invalid password"});

        const token = jwt.sign({
            id: user._id,
            role: user.role,
            createdAt: new Date(),
        }, 'MY_SECRET', {expiresIn: '1d'});
        res.json({
            msg: 'LOGGED IN', token
        });
    } catch (error) {
        res.status(500).json({message: "An error occurred while logging in"});
    }
}

const forgetPassword = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await Users.findOne({email});

        if (user){
            return res.status(200).json({message: "Link sent to your email address", email});
        }  
        return res.status(400).json({message: "User not found"});      
    } catch (error) {
        res.status(500).json({message: "An error occurred while forgetting password"});

    }
}

module.exports = {
    login,
    signUp,
    forgetPassword
}
