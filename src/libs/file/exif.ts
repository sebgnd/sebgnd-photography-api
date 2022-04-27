import exifr from 'exifr';

export type WithPath = {
	filepath: string,
}

/**
 * Return the basic exif from a file or null if the file
 * is not an image.
 * 
 * The basic exif returned are: ISO, shutter speed,
 * aperture and focal length
 */
export const readExifFromImage = async <File extends WithPath>(file: File) => {
	const { filepath } = file;

	const exifRaw = await exifr.parse(filepath, [
		'ISO',
		'ShutterSpeedValue',
		'ApertureValue',
		'FocalLength',
	]);

	if (!exifr) {
		return null;
	}

	return {
		iso: exifRaw.ISO,
		shutterSpeed: exifRaw.ShutterSpeedValue.toString(),
		aperture: exifRaw.ApertureValue.toString(),
		focalLength: exifRaw.FocalLength.toString(),
	}
}