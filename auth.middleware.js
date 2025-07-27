// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//     const token = req.headers.authorization?.replace("Bearer ","");
//     if (!token) {
//         return res.status(401).json({ error: 'No token provided' });
//     }

//     try{
//         const verified = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = verified;
//         next();
//     }catch{
//         res.status(400).json({ error: 'Invalid token' });
//     }
// };


const jwt = require('jsonwebtoken');
const User = require('../models/User.model'); // ✅ Import your User model

module.exports = async (req, res, next) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // ✅ Fetch the user from DB
        const user = await User.findById(verified.id); // assuming `id` is encoded in the token
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user; // now you get full user object in req.user
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
};
