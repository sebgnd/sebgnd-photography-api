import { File } from 'formidable';

import { PersistedEntity } from '@libs/types'

import { readExifFromImage } from '@libs/file/exif';
import { isFileMimetype, Mimetype } from '@libs/file/mimetype';

export type Exif = {
  iso: number;
  shutterSpeed: number;
  aperture: number;
  focalLength: number;
}

export type Image = PersistedEntity & {
  exif: Exif | null;
  type?: 'portrait' | 'landscape',
  categoryId: string,
	status?: 'processing' | 'valid' | 'error',
	temporaryFile?: {
		name: string,
		path: string,
	},
};

export type ImageCreationError = {
	message: string,
	type: 'invalid-image',
};

export type ImageCreationResult = 
	| { image: undefined, error: ImageCreationError }
	| { image: Image, error: undefined };

	// TODO: Update file type
export const createImageFromFile = async (file: File, categoryId: string): Promise<ImageCreationResult> => {
	const isFileCorrectMimetype = isFileMimetype(file, [
		Mimetype.JPG,
		Mimetype.PNG,
	]);

	if (!isFileCorrectMimetype) {
		return {
			image: undefined,
			error: {
				type: 'invalid-image',
				message: 'You must provide a JPG or PNG image',
			},
		}
	}

	const exif = await readExifFromImage({
		path: file.filepath,
	});

	return {
		error: undefined,
		image: {
			categoryId,
			exif,
			temporaryFile: {
				path: file.filepath,
				name: file.originalFilename!,
			},
		},
	}
}
