// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminAuth = require('../middlewares/adminAuth');
const User = require('../models/User.model');
const ExcelRecord = require('../models/ExcelRecord');
const Insight = require('../models/Insight');
const { registerAdmin } = require('../controllers/authControllers');

router.get('/dashboard', adminAuth, async (req, res) => {
    const userCount = await User.countDocuments();
    const recordCount = await ExcelRecord.countDocuments();
    const insightCount = await Insight.countDocuments();
    res.json({ userCount, recordCount, insightCount });
});

router.post('/register', adminAuth, registerAdmin);

router.get('/users', adminAuth, async (req, res) => {
    const users = await User.find().select('-password');
    res.json(users);
});




// router.get('/records', adminAuth, async (req, res) => {
//     const records = await ExcelRecord.find().populate('user', 'name email');
//     res.json(records);
// });
router.get('/records', adminAuth, async (req, res) => {
    const records = await ExcelRecord.find().populate('data', 'uploadedBy uploadedAt');
    res.json(records);
});

router.get('/insight', adminAuth, async (req, res) => {
    const insights = await Insight.find().populate('user', 'name email');
    res.json(insights);
});

module.exports = router;
