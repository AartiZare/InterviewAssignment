const uploadService = require('../services/uploadService');

exports.upload = async (req, res) => {
    try {
        const result = await uploadService.processUpload(req.files.excel);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
