const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const uploadExcel = async (req, res) => {
    try {
        console.log(req.file);
        const workbook = xlsx.readFile(req.file.path);
        console.log(`workbook : ${workbook}`);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        console.log(`sheet  : ${sheet}`);

        const data = xlsx.utils.sheet_to_json(sheet);
        console.log(`data : ${data}`)

        fs.unlinkSync(req.file.path); // cleanup temp file
        res.json({ data });
    } catch (error) {
        res.status(500).send('Error processing file');
    }
};

module.exports = {
    uploadExcel,
};
