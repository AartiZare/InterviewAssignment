const XlsxPopulate = require('xlsx-populate');
const fs = require('fs').promises;
const { Readable } = require('stream');

exports.processUpload = async (excelFile) => {
    const tempFilePath = `${process.env.UPLOAD_PATH}/temp_${excelFile.name}`;
    const updatedFilePath = `${process.env.UPLOAD_PATH}/updated_${excelFile.name}`;

    try {
        const readableStream = new Readable();
        readableStream.push(excelFile.data);
        readableStream.push(null);
        await fs.writeFile(tempFilePath, excelFile.data);

        const workbook = await XlsxPopulate.fromFileAsync(tempFilePath);
        const sheet = workbook.sheet(0);

        const chunkSize = 1024 * 1024; // 1MB chunk size
        const totalRows = 10000;

        const usedRange = sheet.usedRange();
        if (!usedRange) return { success: false, message: "Sheet is empty" };

        const statusColumnIndex = findColumnIndex(sheet, 'status');
        if (statusColumnIndex === -1) {
            return { success: false, message: "Status column not found" };
        }

        let failedCount = 0;
        let successCount = 0;

        for (let chunkStart = 2; chunkStart <= totalRows; chunkStart += chunkSize) {
            const chunkEnd = Math.min(chunkStart + chunkSize - 1, totalRows);

            for (let rowIndex = chunkStart; rowIndex <= chunkEnd; rowIndex++) {
                const status = rowIndex % 2 === 0 ? 'failed' : 'success';
                sheet.cell(rowIndex, statusColumnIndex).value(status);

                if (status === 'failed') {
                    failedCount++;
                } else if (status === 'success') {
                    successCount++;
                }
            }
            await workbook.toFileAsync(updatedFilePath);
        }

        console.log('Failed Count:', failedCount);
        console.log('Success Count:', successCount);

        return { success: true, filePath: updatedFilePath };
    } catch (error) {
        console.error(error);
        throw new Error('Error processing upload');
    } finally {
        // Cleanup: remove the temporary file
        await fs.unlink(tempFilePath).catch(console.error);
    }
};

function findColumnIndex(sheet, columnName) {
    const usedRange = sheet.usedRange();
    return usedRange ? Array.from({ length: usedRange.endCell().columnNumber() }, (_, i) => i + 1)
        .find(columnIndex => sheet.cell(usedRange.startCell().rowNumber(), columnIndex).value()?.toLowerCase() === columnName.toLowerCase()) || -1 : -1;
}
