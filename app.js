// const express = require('express');
// const fileUpload = require('express-fileupload');
// const dotenv = require('dotenv');

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(fileUpload());

// const uploadRoutes = require('./routes/uploadRoutes');
// app.use('/api', uploadRoutes);

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

const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api', uploadRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
