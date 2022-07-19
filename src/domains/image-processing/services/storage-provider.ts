import * as fs from 'fs';
import { S3, PutObjectCommand, DeleteObjectCommand, HeadObjectCommandInput } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const s3 = new S3({
	region: 'eu-west-3',
});

export type StorageUploadFn = (pathOrBuffer: string | Buffer, destinationPath: string) => Promise<void>;
export type StorageDeleteFn = (path: string) => Promise<void>;
export type StorageExistsFn = (path: string) => Promise<boolean>;
export type StorageProvider = {
	upload: StorageUploadFn;
	delete: StorageDeleteFn,
	exists: StorageExistsFn,
}

const createStreamFromPath = (path: string) => {
	if (!fs.existsSync(path)) {
		throw new Error(`Path does not exist: ${path}`);
	}

	return fs.createReadStream(path);
}

const createStreamFromBuffer = (buffer: Buffer) => {
	return Readable.from(buffer);
}

const uploadFileToBucket: StorageUploadFn = async (pathOrBuffer, destinationPath) => {
	const fileStream = typeof pathOrBuffer === 'string'
		? createStreamFromPath(pathOrBuffer)
		: createStreamFromBuffer(pathOrBuffer);

	const uploadCommand = new PutObjectCommand({
		Body: fileStream,
		Key: destinationPath,
		Bucket: process.env.AWS_S3_BUCKET!,
	});

	await s3.send(uploadCommand);
};

const deleteFromBucket: StorageDeleteFn = async (path) => {
	const deleteCommand = new DeleteObjectCommand({
		Bucket: process.env.AWS_S3_BUCKET!,
		Key: path,
	});

	await s3.send(deleteCommand);
};

const objectExistsInBucket: StorageExistsFn = async (path) => {
	return new Promise((resolve, reject) => {
		const params: HeadObjectCommandInput = {
			Key: path,
			Bucket: process.env.AWS_S3_BUCKET!,
		};

		s3.headObject(params, (err) => {
			if (err) {
				if (err.statusCode === 404) {
					return resolve(false);
				}

				return reject(err);
			}

			return resolve(true);
		});
	});
};

export const storageProvider: StorageProvider = {
	upload: uploadFileToBucket,
	delete: deleteFromBucket,
	exists: objectExistsInBucket,
};
