import * as path from 'path';
import * as fs from 'fs'

import { createController } from '../../../libs/famework/controller';

export const imageFileController = createController('files/images', ({ builder }) => {
	builder.get('/:format/:size/:id', {
		handler: (req, res) => {
			const { format, size, id } = req.params;
			const availableFormats = ['thumbnail', 'full'];
			const availableSizes = ['400', '1080', '80'];
			
			if (!availableFormats.includes(format) || !availableSizes.includes(size)) {
				res.status(400).json({
					error: {
						message: 'Invalid image',
						details: {
							format: 'Must be thumbnail or full',
							size: 'Must be small, medium or original',
						},
					},
				});

				return;
			}

			const imagePath = path.join('files', 'images', format, size, id) + '.jpg';
			const imagePathExist = fs.existsSync(imagePath);

			if (!imagePathExist) {
				res.status(404).json({
					error: {
						message: 'Image does not exist',
					},
				});

				return;
			}

			res.download(imagePath);
		}
	});
});
