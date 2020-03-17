const fs = require('fs');
const dotenv = require('dotenv');
const vision = require('@google-cloud/vision');

dotenv.config();

module.exports = {
	async upload (req, res) {
		try {
			//! Dont Remove It yet
			console.log('FILE: ', req.file);
			console.log('BODY DATA: ', req.body);

			// Dir folder for save image
			imageDir = `${process.cwd()}/image/`;


			// Check if folder exist if not creat one
			if (!fs.existsSync(imageDir)) {
				fs.mkdirSync(imageDir, { recursive: true }, error => {
					if (error) {
						console.error('Create logo dir error: ', error);
						return res.status(500).send({
							error: `Error from Create logo dir: ${error}`,
						});
					}
				});
			}

			// Creates a client
			const client = new vision.ImageAnnotatorClient({
				keyFilename: `${process.cwd()}/APIKey.json`
			});

			// Performs label detection on the image file
			client
				.labelDetection(`${imageDir}${req.file.filename}`)
				.then(results => {
					const labels = results[0].labelAnnotations;

					console.log('Labels:');
					labels.forEach(label => console.log(label));
					// console.log(results);

					res.status(200).json({ data: labels });

					// Remove original image from /temps/logo
					setTimeout(() => {
						fs.unlink(req.file.path, () => {
							// res.json({ file: `./src/temps/logo/${req.file.filename}` });
						});
					}, 1000);
				})
				.catch(err => {
					console.error('ERROR:', err);
					res.status(500).json({ status: false, message: `Error: ${err}` });
				});
		} catch (error) {
			console.error(error.toString());
			return res.status(500).send({
				error: `Error from upload Logo: ${error}`,
			});
		}
		return true;
	}
}
