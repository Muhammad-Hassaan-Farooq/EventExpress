const checkOrganizer = async (req, res, next) => {
  const userRole = req.user.role;
  if (userRole === "organizer") {
    next();
  } else {
    return res
      .status(400)
      .json({
        success: false,
        message: "You are not authorized to perform this action",
      });
  }
};

module.exports = { checkOrganizer };
