

const express = require('express');
const router = express.Router();
const {register, login} = require('../controllers/authControllers');
const {uploadExcel} = require('../controllers/fileControllers')

router.post('/register', register);
router.post('/login', login);
// router.post('/excel/upload', verifyToken, upload.single('file'),uploadExcel)

module.exports = router;
// This code defines the authentication routes for user  and registration and login.
