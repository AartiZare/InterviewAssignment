const express = require('express');
const fileUpload = require('express-fileupload');
const XLSX = require('xlsx');

const app = express();
const port = 3000;

app.use(fileUpload());

app.post('/upload', (req, res) => {
if (!req.files || Object.keys(req.files).length === 0) {
return res.status(400).send('No file uploaded.');
}

const excelFile = req.files.excel;

const workbook = XLSX.read(excelFile.data, { type: 'buffer' });

const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

const updatedData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })
.map((row, rowIndex) => {

if (rowIndex === 0) return row;

const status = rowIndex % 2 === 0 ? 'failed' : 'success';
row.push(`${rowIndex + 1}: ${status}`);
return row;
});

const updatedSheet = XLSX.utils.aoa_to_sheet(updatedData);

const updatedWorkbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(updatedWorkbook, updatedSheet, sheetName);

const updatedExcel = XLSX.write(updatedWorkbook, { bookType: 'xlsx', type: 'buffer' });

res.set('Content-Type', "attachment; filename=updatedExcel-export.xlsx");
res.set('Content-Disposition', `attachment; filename=updated_${excelFile.name}`);

res.send(updatedExcel);
});

app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});

// //checking
// const sheet = XLSX.utils.aoa_to_sheet([['status']]);
// for (let rowIndex = 2; rowIndex <= 10; rowIndex++) {
// const status = rowIndex % 2 === 0 ? 'failed' : 'success';
// XLSX.utils.sheet_add_aoa(sheet, [[status]], { origin: `A${rowIndex}` });
// }

// const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
// console.log(data, "all data");
// const updatedData = data.map((row, rowIndex) => {
// if (rowIndex === 0) return row;
// const status = rowIndex % 2 === 0 ? 'failed' : 'success';
// row.push(`${rowIndex + 1}: ${status}`);
// return row;
// });

// console.log('Updated Data Rows:');
// for (let i = 0; i < 10 && i < updatedData.length; i++) {
// console.log(`Row ${i + 1}: [${updatedData[i].slice(1).join(', ')}]`);
// }

