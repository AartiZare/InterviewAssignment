const XlsxPopulate = require('xlsx-populate');

exports.processUpload = async (excelFile) => {
    const filePath = `${process.env.UPLOAD_PATH}/updated_${excelFile.name}`;

    try {
        const workbook = await XlsxPopulate.fromDataAsync(excelFile.data);
        const sheet = workbook.sheet(0);

        const chunkSize = 500;
        const totalRows = 10000;

        const usedRange = sheet.usedRange();
        if (!usedRange) return { success: false, message: "Sheet is empty" };

        const statusColumnIndex = findColumnIndex(sheet, 'status');
        if (statusColumnIndex === -1) {
            console.error("Status column not found");
            return { success: false, message: "Status column not found" };
        }

        for (let chunkStart = 2; chunkStart <= totalRows; chunkStart += chunkSize) {
            const chunkEnd = Math.min(chunkStart + chunkSize - 1, totalRows);
            for (let rowIndex = chunkStart; rowIndex <= chunkEnd; rowIndex++) {
                const status = rowIndex % 2 === 0 ? 'failed' : 'success';
                sheet.cell(rowIndex, statusColumnIndex).value(status);
            }
            await workbook.toFileAsync(filePath);
        }

        return { success: true, filePath };
    } catch (error) {
        console.error(error);
        throw new Error('Error processing upload');
    }
};

function findColumnIndex(sheet, columnName) {
    const usedRange = sheet.usedRange();
    return usedRange ? Array.from({ length: usedRange.endCell().columnNumber() }, (_, i) => i + 1)
        .find(columnIndex => sheet.cell(usedRange.startCell().rowNumber(), columnIndex).value()?.toLowerCase() === columnName.toLowerCase()) || -1 : -1;
}
