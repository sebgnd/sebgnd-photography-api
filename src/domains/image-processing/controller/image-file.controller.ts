import {
	getImagePathIfExist,
	validFormatAndSize,
	availableFormats,
	availableSizes,
	ImageFormat,
	ImageSize,
} from '@domains/image-processing/services/image-file-manager';

import { createController } from '@libs/famework/controller';

export const imageFileController = createController('file/images', ({ builder }) => {
	builder.get('/:format/:size/:id', {
		handler: (req, res) => {
			const { format, size, id } = req.params;
			
			if (!validFormatAndSize(format, size)) {
				res.status(400).json({
					error: {
						message: 'Invalid image',
						details: {
							format: `Must be one of: ${availableFormats.join(',')}`,
							size: `Must be one of: ${availableSizes.join(',')}`,
						},
					},
				});

				return;
			}

			/**
			 * At that point we know that format and size have the right types
			 */
			const imagePath = getImagePathIfExist(id, {
				format: format as ImageFormat,
				size: size as ImageSize,
			});

			if (!imagePath) {
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