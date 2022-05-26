import exifr from 'exifr';

export type WithPath = {
	path: string,
}

export const EXIF_PROPERTIES = [
	'ISO',
	'ShutterSpeedValue',
	'ApertureValue',
	'FocalLength',
];

/**
 * Return the basic exif from a file or null if the file
 * is not an image.
 * 
 * The basic exif returned are: ISO, shutter speed,
 * aperture and focal length
 */
export const readExifFromImage = async <File extends WithPath>(file: File) => {
	const { path } = file;


	const exifRaw = await exifr.parse(path, EXIF_PROPERTIES);
	const isExifValid = exifRaw && Object.keys(exifRaw).length === EXIF_PROPERTIES.length;
	
	if (!isExifValid) {
		return null;
	}

	return {
		iso: exifRaw.ISO,
		shutterSpeed: exifRaw.ShutterSpeedValue?.toString(),
		aperture: exifRaw.ApertureValue?.toString(),
		focalLength: exifRaw.FocalLength?.toString(),
	}
}