const checkAdmin = async(req, res, next) => {
    const userRole = req.user.role;
    if (userRole === 'admin'){
       next();
    }
    else {
        return res.status(400).json({ message: 'Unauthorized Access (Only admins allowed)' });
    }
}

module.exports = {checkAdmin};