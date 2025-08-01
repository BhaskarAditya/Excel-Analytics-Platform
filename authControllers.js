const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User.model');

const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hash });
        await user.save();
    const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET);

        res.status(200).json({status:200, token, data:user, message:'success'});
    } catch (error) {
        res.status(500).send('Registration failed');
    }
};

const registerAdmin = async (req, res) => {
    const { name, email, password, } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hash, role: 'admin' });
        await user.save();
    const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET);

        res.status(200).json({status:200, token, data:user, message:'success'});
    } catch (error) {
        res.status(500).send('Registration failed');
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if(!user) return res.status(401).send('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send('Invalid credentials');

    const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET);
    res.json({token, role: user.role});
};

module.exports = {
    register,
    login,
    registerAdmin,
};
