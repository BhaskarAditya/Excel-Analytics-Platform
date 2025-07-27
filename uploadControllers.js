const xlsx = require('xlsx');
const ExcelRecord = require('../models/ExcelRecord');

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const workbook = xlsx.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const parsedData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const newRecord = new ExcelRecord({
            data: parsedData, // ✅ this must match your schema
            uploadedBy: req.user._id // or however you get user ID
        });

        const saved = await newRecord.save();

        res.status(201).json({
            message: 'File uploaded and data saved',
            recordId: saved._id
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
});
