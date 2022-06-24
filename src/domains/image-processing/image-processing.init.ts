import * as fs from 'fs';

export const initFileSystem = async () => {
	const paths = [
		'files/images/full/400',
		'files/images/full/1080',
		'files/images/full/original',
		'files/images/thumbnail/80',
		'files/images/thumbnail/400',
	];

	console.log('SYSTEM | Initializing file system');

	for (const dirPath of paths) {
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, {
				recursive: true,
			});
		}
	}

  return Promise.resolve();
}