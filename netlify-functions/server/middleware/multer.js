const multer = require("multer");
const storage = multer.diskStorage({});

const upload = multer({ storage });

module.exports = upload;
// The code snippet above is a middleware that uses multer to handle file uploads. It exports the upload object, which is used in the createProduct controller to upload images to Cloudinary.
// The upload object is used in the createProduct controller to handle file uploads. It uses multer to store files in memory and pass them to the controller for processing.
