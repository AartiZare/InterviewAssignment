const XlsxPopulate = require('xlsx-populate');
const fs = require('fs/promises');
const dotenv = require('dotenv');

dotenv.config();

exports.processUpload = async (excelFile) => {
    const filePath = `${process.env.UPLOAD_PATH}/updated_${excelFile.name}`;

    try {
        const workbook = await XlsxPopulate.fromDataAsync(excelFile.data);
        const sheet = workbook.sheet(0);

        // Update status column up to rowIndex 10
        for (let rowIndex = 2; rowIndex <= 10; rowIndex++) {
            const status = rowIndex % 2 === 0 ? 'failed' : 'success';
            sheet.cell(`A${rowIndex}`).value(`${status}`);
        }

        await workbook.toFileAsync(filePath);

        return { success: true, filePath };
    } catch (error) {
        console.error(error);
        throw new Error('Error processing upload');
    }
};
