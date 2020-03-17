// Handling multipart/form-data, uses for uploading files
const multer = require('multer');

// Set max image size to 50MB
const MAX_SIZE = 1024 * 1024 * 50;

// Set upload path and file name
const storage = multer.diskStorage({
	destination (req, file, cb) {
		cb(null, './image');
	},
	filename (req, file, cb) {
		const currentTime = req.headers.currenttime;
		const newImageName = `${currentTime}_${file.originalname}`;

		// Save image with actual date + original image name
		cb(null, newImageName);
	},
});

// Check file type
const fileFilter = (req, file, cb) => {
	// Reject a file
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

// Set multer for file upload, rename and save
const upload = multer({ storage, limits: { fileSize: MAX_SIZE } }, fileFilter);

// Call UploadController
const UploadController = require('../controllers/UploadController');

module.exports = app => {
	// Create POST rout for take image from Vue JS
	app.post('/upload', upload.single('file'), UploadController.upload);

	// After upload check file size
	app.use(function (err, req, res, next) {
		if (err.code === 'LIMIT_FILE_SIZE') {
			res.status(422).json({ error: `Too large. Max size is ${MAX_SIZE / 1000}kb` });
		}
	});
};
