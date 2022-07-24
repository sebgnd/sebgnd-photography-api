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

export const convertFocalLength = (value: number): string => {
	return `${value}mm`;
};

export const convertShutterSpeed = (value: number): string => {
	const divider = Math.pow(2, value);
	const speed = Math.round((1 / divider) * 10) / 10;

	return speed <= 0.4
		? `1/${Math.round(divider)}s`
		: `${speed}s`;
};

export const convertAperture = (value: number): string => {
	const fStop = Math.pow(1.4142, value);
	const roundedFStop = Math.round(fStop * 10) / 10;

	return `f/${roundedFStop}`;
}

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
	const isExifValid = Object.keys(exifRaw || {}).length === EXIF_PROPERTIES.length;
	
	if (!isExifValid) {
		return null;
	}

	return {
		iso: exifRaw.ISO,
		shutterSpeed: convertShutterSpeed(exifRaw.ShutterSpeedValue),
		aperture: convertAperture(exifRaw.ApertureValue),
		focalLength: convertFocalLength(exifRaw.FocalLength),
	}
}