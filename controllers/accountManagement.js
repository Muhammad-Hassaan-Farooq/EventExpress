const Users = require('../models/User');

const getAllOrganizers = async (req,res) =>{
    try {
        const organizers = await Users.find({role:"organizer", isDeleted: false}).select("-password");
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
        let user = await Users.findOne({email, isDeleted: false});
        
        if (user){
            if (req.user.role === "superAdmin"){

            user.isDeleted = true;
            user.deletedBy = req.user.id;
            user.deletedAt = new Date(Date.now());
            await user.save();
            return res.status(200).json({message: "Account deleted successfully"});
            }
            if (user.role === "user" || user.role === "organizer"){
                user.isDeleted = true;
                user.deletedBy = req.user.id;
                user.deletedAt = new Date(Date.now());
                await user.save();
                return res.status(200).json({message: "Account deleted successfully"});

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
        
        let user = await Users.findOne({email, isDeleted: false});

        if (!user) return res.status(200).json({success:true , msg: "User not found",data:[]});
        
        if (req.user.role === "superAdmin"){
            user.role = role;
            user.updatedBy = req.user.id;
            user.updatedAt = new Date(Date.now());
            await user.save();
            return res.status(200).json({success:true, msg: "Role changed successfully",data:[]});
        }
        
        if (user.role === "user" || user.role === "organizer"){
            if (role === "superAdmin" || role === "admin") return res.status(200).json({success: false ,msg: "You can only change the role of a user or organizer",data:[]});
            user.role = role;
            user.updatedBy = req.user.id;
            user.updatedAt = new Date(Date.now());
            await user.save();
            return res.status(200).json({success:true, msg: "Role changed successfully",data:[]});
        }
        return res.status(400).json({success: false ,msg: "You can only change the role of a user or organizer",data:[]});
    

    } catch (error) {
        res.status(500).json({success:false ,msg: "An error occurred while changing the role",data:[]});
    }
}

module.exports = {getAllOrganizers,deleteAccount,changeRole}