const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const verifyToken = require('../middlewares/auth.middleware');
const ExcelRecord = require('../models/ExcelRecord'); // ✅ required model

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', verifyToken, upload.single('excel'), async (req, res) => {
    try {
        // Step 1: Read uploaded Excel file
        const workbook = xlsx.readFile(req.file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        // Step 2: Delete temp file
        fs.unlinkSync(req.file.path);

        // Step 3: Save parsed data into MongoDB
        const newRecord = new ExcelRecord({

            data,
            uploadedBy: req.user._id // ✅ set by verifyToken middleware
        });

        const saved = await newRecord.save();

        // Step 4: Return recordId
        res.status(201).json({
            message: 'File uploaded and saved',
            recordId: saved._id,
            data,

        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
});

module.exports = router;
