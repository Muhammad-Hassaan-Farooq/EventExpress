const checkAdmin = async(req, res, next) => {
    const userRole = req.user.role;
    if (userRole === 'admin' || userRole === 'superAdmin'){
       next();
    }
    else {
        return res.status(400).json({ message: 'Unauthorized Access (must be admin)' });
    }
}

module.exports = {checkAdmin};