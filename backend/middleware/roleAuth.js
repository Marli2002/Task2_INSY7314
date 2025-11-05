// middleware/roleAuth.js
function roleCheck(role) {
    return (req, res, next) => {
        if (!req.employee) return res.status(401).json({ msg: 'Not authenticated' });
        if (req.employee.role !== role) return res.status(403).json({ msg: 'Access denied' });
        next();
    };
}

module.exports = roleCheck;
