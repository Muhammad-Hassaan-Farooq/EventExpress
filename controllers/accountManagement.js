const Users = require('../models/User');

const getAllOrganizers = async (req,res) =>{
    try {
        const organizers = await Users.find({role:"organizer"}).select("-password");
        if (!organizers) {
            return res.status(200).json({success:true,msg: "No organizers found",data:[]});
        }
        res.status(200).json({success:true,msg: "Organizers found",data:organizers});
    }
    catch (err) {
        return res.status(500).json({success:false ,msg: "An error occurred while getting organizers",data:[]});
    }   
}

const deleteAccount = async (req, res) => {
    try {
        const {email} = req.body;
        let user = await Users.findOne({email});
        if (user){
            if (req.user.role === "superAdmin"){
            await Users.deleteOne({email});
            return res.status(200).json({success:true ,msg: "Account deleted successfully",data:[]});
            }
            if (user.role === "user" || user.role === "organizer"){
                await Users.deleteOne({email});
                return res.status(200).json({success:true ,msg: "Account deleted successfully",data:[]});
            }
            return res.status(200).json({success: false ,msg: "You can only delete the account of a user or organizer",data:[]});
        }
    }catch (error) {
        res.status(500).json({success:false ,msg: "An error occurred while deleting the account",data:[]});
    }
}

const changeRole = async (req, res) => {
    try {
        const {email, role} = req.body;
        
        let user = await Users.findOne({email});

        if (!user) return res.status(200).json({success:true , msg: "User not found",data:[]});
        
        if (req.user.role === "superAdmin"){
            user.role = role;
            await user.save();
            return res.status(200).json({success:true, msg: "Role changed successfully",data:[]});
        }
        
        if (user.role === "user" || user.role === "organizer"){
            if (role === "superAdmin" || role === "admin") return res.status(200).json({success: false ,msg: "You can only change the role of a user or organizer",data:[]});
            user.role = role;
            await user.save();
            return res.status(200).json({success:true, msg: "Role changed successfully",data:[]});
        }
        return res.status(400).json({success: false ,msg: "You can only change the role of a user or organizer",data:[]});
    

    } catch (error) {
        res.status(500).json({success:false ,msg: "An error occurred while changing the role",data:[]});
    }
}

module.exports = {getAllOrganizers,deleteAccount,changeRole}