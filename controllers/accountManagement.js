const Users = require("../models/User");

const getAllOrganizers = async (req, res) => {
  try {
    const organizers = await Users.find({
      role: "organizer",
      isDeleted: false,
    }).select("-password");
    if (organizers.length === 0) {
      return res
        .status(200)
        .json({ success: false, message: "No organizers found" });
    }
    return res.status(200).json({ success: true, data: organizers, message: "Organizers fetched successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getOrganizerByName = async (req, res) => {
  const fullName = req.body.name.trim();
  const names = fullName.split(' ');
  const firstName = names[0];
  const lastName = names.slice(1).join(' ');

  try {
    const searchCriteria = {
      role: "organizer",
      isDeleted: false,
      $or: [
        { firstName: { $regex: new RegExp('^' + firstName + '$', 'i') } },
        { 
          $and: [
            { firstName: { $regex: new RegExp('^' + firstName + '$', 'i') } },
            { lastName: { $regex: new RegExp('^' + lastName + '$', 'i') } }
          ]
        }
      ]
    };

    const organizers = await Users.find(searchCriteria).select("-password");

    if (organizers.length === 0) {
      return res
        .status(200)
        .json({ success: false, message: "No organizer found with this name" });
    }
    return res.status(200).json({ success: true, data: organizers, message: "Organizer fetched successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}


const getAllUsers = async (req, res) => {
  try {
    const users = await Users.find({
      role: "user",
      isDeleted: false,
    }).select("-password");

    if (users.length === 0) {
      return res
        .status(200)
        .json({ success: false, message: "No users found" });
    }
    return res.status(200).json({ success: true, data: users, message: "Users fetched successfully"});

  } catch (err) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};


const getUserByName = async (req, res) => {
  const fullName = req.body.name.trim();
  const names = fullName.split(' ');
  const firstName = names[0];
  const lastName = names.slice(1).join(' ');

  try {
    const searchCriteria = {
      role: "user",
      isDeleted: false,
      $or: [
        { firstName: { $regex: new RegExp('^' + firstName + '$', 'i') } },
        { 
          $and: [
            { firstName: { $regex: new RegExp('^' + firstName + '$', 'i') } },
            { lastName: { $regex: new RegExp('^' + lastName + '$', 'i') } }
          ]
        }
      ]
    };

    const users = await Users.find(searchCriteria).select("-password");

    if (users.length === 0) {
      return res
        .status(200)
        .json({ success: false, message: "No user found with this name" });
    }
    return res.status(200).json({ success: true, data: users, message: "User fetched successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}


const deleteAccount = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await Users.findOne({ email, isDeleted: false });

    if (user) {
      if (req.user.role === "superAdmin") {
        user.isDeleted = true;
        user.deletedBy = req.user.id;
        user.deletedAt = new Date(Date.now());
        await user.save();
        return res
          .status(200)
          .json({ success: true, message: "Account deleted successfully" });
      }
      if (user.role === "user" || user.role === "organizer") {
        user.isDeleted = true;
        user.deletedBy = req.user.id;
        user.deletedAt = new Date(Date.now());
        await user.save();
        return res
          .status(200)
          .json({ success: true, message: "Account deleted successfully" });
      }
      return res.status(401).json({
        success: true,
        message: "You can only delete the account of a user or organizer",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const changeRole = async (req, res) => {
  try {
    const { email, role } = req.body;

    let user = await Users.findOne({ email, isDeleted: false });

    if (!user) return res.status(400).json({ message: "User not found" });

    if (req.user.role === "superAdmin") {
      user.role = role;
      user.updatedBy = req.user.id;
      user.updatedAt = new Date(Date.now());
      await user.save();
      return res.status(200).json({ success: true, message: "Role changed" });
    }

    if (user.role === "user" || user.role === "organizer") {
      if (role === "superAdmin" || role === "admin")
        return res.status(401).json({
          success: true,
          message: "You can only change the role from user to organizer or organizer to user."
        });
      user.role = role;
      user.updatedBy = req.user.id;
      user.updatedAt = new Date(Date.now());
      await user.save();
      return res.status(200).json({ success: true, message: "Role changed" });
    }
    return res.status(401).json({
      success: true,
      message: "You can only change the role of a user or organizer",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


module.exports = { getAllOrganizers, getAllUsers, deleteAccount, changeRole, getOrganizerByName, getUserByName };

