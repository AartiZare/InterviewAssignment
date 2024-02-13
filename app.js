// const express = require('express');
// const fileUpload = require('express-fileupload');
// const XlsxPopulate = require('xlsx-populate');
// const fs = require('fs/promises');

// const app = express();
// const port = 3000;

// app.use(fileUpload());

// app.post('/upload', async (req, res) => {
//     if (!req.files || Object.keys(req.files).length === 0) {
//         return res.status(400).send('No file uploaded.');
//     }

//     const excelFile = req.files.excel;
//     const filePath = `public/updated_${excelFile.name}`;

//     try {
//         const workbook = await XlsxPopulate.fromDataAsync(excelFile.data);

//         const sheet = workbook.sheet(0);

//         // Update status column up to rowIndex 10
//         for (let rowIndex = 2; rowIndex <= 10; rowIndex++) {
//             const status = rowIndex % 2 === 0 ? 'failed' : 'success';
//             sheet.cell(`A${rowIndex}`).value(`${status}`);
//         }

//         await workbook.toFileAsync(filePath);

//         res.set('Content-Type', 'application/json');
//         res.json({ success: true, filePath });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

const express = require('express');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(fileUpload());

// Load routes
const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api', uploadRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
