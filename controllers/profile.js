const Users = require("../models/User");
const bcrypt = require("bcrypt");


const changePassword = async (req, res) => {
    try {

    const {email, oldPassword, newPassword} = req.body;
    let user = await Users.findOne({email});
    if (!user){
        return res.status(404).json({message: "User not found"});
    }

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

const deleteMyAccount = async (req, res) => {
    try {
        if (!req.body.password) {
            return res.status(400).json({ message: "Password is required to delete the account" });
        }
        const user = await Users.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Incorrect password. Please try again." });
        }
        await Users.deleteOne({ _id: req.user.id });
        return res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while deleting the account" });
    }
}


module.exports = {
    changePassword,
    deleteMyAccount,
};