const Users = require('../models/User');

const getAllOrganizers = async (req,res) =>{
    try {
        const organizers = await Users.find({role:"organizer"}).select("-password");
        if (!organizers) {
            return res.status(400).json({msg: "No organizers found"});
        }
        res.json(organizers);
    }
    catch (err) {
        return res.status(500).json({msg: err.message});
    }   
}

const deleteOrganizer = async (req,res) =>{
    try {
        const organizer = await Users.findByIdAndDelete(req.params.id);
        if (!organizer) {
            return res.status(400).json({msg: "No organizer with the following id found"});
        }
        res.json({msg: "Organizer deleted"});
    }
    catch (err) {
        return res.status(500).json({msg: err.message});
    }
}

module.exports = {getAllOrganizers,deleteOrganizer}