import * as fs from 'fs';
import * as path from 'path';
import { updateImageProcessing } from '../database/image/image.repository';

export type ImageUploaded = {
	id: string,
	originalName: string,
	temporaryPath: string,
};

export const handleImageUploaded = async (images: ImageUploaded[]) => {
	await Promise.all(
		images.map(async ({ id, originalName, temporaryPath }) => {
			await new Promise((resolve, reject) => {
				const oldPath = temporaryPath;
				const extension = path.extname(originalName);
				const newPath = `files/images/full/original/${id}${extension}`;

				fs.copyFile(oldPath, newPath, (err) => {
					if (err) {
						reject(err);
					}
	
					resolve(undefined);
				});
			});
			
			await updateImageProcessing(id, false);
		}),
	)
};
