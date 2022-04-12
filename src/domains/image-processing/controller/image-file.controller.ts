import express, { Request, Response } from 'express';
import * as path from 'path';
import * as fs from 'fs'

export const imageFileController = express.Router();

imageFileController.get('/file/images/:format/:size/:id', (req: Request, res: Response) => {
	const { format, size, id } = req.params;
	const availableFormats = ['thumbnail', 'full'];
	const availableSizes = ['400', '1080', '80'];
	
	if (!availableFormats.includes(format) || !availableSizes.includes(size)) {
		return res.status(400).json({
			error: {
				message: 'Invalid image',
				details: {
					format: 'Must be thumbnail or full',
					size: 'Must be small, medium or original',
				},
			},
		});
	}

	const imagePath = path.join('files', 'images', format, size, id) + '.jpg';
	const imagePathExist = fs.existsSync(imagePath);

	if (!imagePathExist) {
		return res.status(404).json({
			error: {
				message: 'Image does not exist',
			},
		});
	}

	return res.download(imagePath);
});
