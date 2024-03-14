const checkOrganizer = async(req, res, next) => {
        const userRole = req.user.role;
        if (userRole === 'organizer'){
           next();
        }
        else {
            return res.status(400).json({ message: 'Unauthorized Access' });
        }
    }

module.exports = {checkOrganizer};