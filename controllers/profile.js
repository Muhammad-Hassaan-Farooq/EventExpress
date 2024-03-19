const Users = require("../models/User");
const bcrypt = require("bcrypt");


const changePassword = async (req, res) => {
    try {

    const {email, oldPassword, newPassword} = req.body;
    let user = await Users.findOne({email});

    if (user){
        const passwordCheck = await bcrypt.compare(oldPassword, user.password);
        if (passwordCheck){
            user.password = await bcrypt.hash(newPassword, 5);
            await user.save();
            return res.status(200).json({message: "Password changed successfully"});
        }
        return res.status(400).json({message: "Invalid password"});
    }
} catch (error) {
    res.status(500).json({message: "An error occurred while changing the password"});
    }
}


const changeRole = async (req, res) => {
    try {
        const {email, role} = req.body;
        
        let user = await Users.findOne({email});

        if (!user) return res.status(400).json({message: "User not found"});
        
        if (req.user.role === "superAdmin"){
            user.role = role;
            await user.save();
            return res.status(200).json({message: "Role changed successfully"});
        }
        
        if (user.role === "user" || user.role === "organizer"){
            if (role === "superAdmin" || role === "admin") return res.status(400).json({message: "You can't change the role to Admin"});
            user.role = role;
            await user.save();
            return res.status(200).json({message: "Role changed successfully"});
        }
        return res.status(400).json({message: "You can only change the role of a user or organizer"});
    

    } catch (error) {
        res.status(500).json({message: "An error occurred while changing the role"});
    }


}

const deleteAccount = async (req, res) => {
    try {
        const {email} = req.body;
        let user = await Users.findOne({email});
        if (user){
            if (req.user.role === "superAdmin"){
            await Users.deleteOne({email});
            return res.status(200).json({message: "Account deleted successfully"});
            }
            if (user.role === "user" || user.role === "organizer"){
                await Users.deleteOne({email});
                return res.status(200).json({message: "Account deleted successfully"});
            }
            return res.status(400).json({message: "You can only delete the account of a user or organizer"});
        }
    }catch (error) {
        res.status(500).json({message: "An error occurred while deleting the account"});
    }
}

const deleteMyAccount = async (req, res) => {
    try {
        // Check if the password is provided in the request body
        if (!req.body.password) {
            return res.status(400).json({ message: "Password is required to delete the account" });
        }
        
        // Retrieve the user from the database
        const user = await Users.findById(req.user.id);
        
        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare the provided password with the hashed password stored in the database
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);

        // If the passwords don't match, return an error
        if (!passwordMatch) {
            return res.status(401).json({ message: "Incorrect password. Please try again." });
        }

        // If the passwords match, proceed with deleting the account
        await Users.deleteOne({ _id: req.user.id });
        
        return res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while deleting the account" });
    }
}


module.exports = {
    changePassword,
    changeRole,
    deleteMyAccount,
    deleteAccount
};