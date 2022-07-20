import * as fs from 'fs';
import { Readable } from 'stream';

import {
	S3,
	PutObjectCommand,
	DeleteObjectCommand,
	HeadObjectCommandInput,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const s3 = new S3({
	region: 'eu-west-3',
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	}
});

export type StorageUploadFn = (pathOrBuffer: string | Buffer, destinationPath: string) => Promise<void>;
export type StorageDeleteFn = (path: string) => Promise<void>;
export type StorageExistsFn = (path: string) => Promise<boolean>;
export type GetFileFn = (path: string) => Promise<ReadableStream>;
export type GetFolderSeparatorFn = () => string;
export type StorageProvider = {
	upload: StorageUploadFn;
	delete: StorageDeleteFn,
	exists: StorageExistsFn,
	get: GetFileFn,
	getFolderSeparator: GetFolderSeparatorFn,
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

const uploadFromPath = async (path: string, destinationPath: string) => {
	const uploadCommand = new PutObjectCommand({
		Body: createStreamFromPath(path),
		Key: destinationPath,
		Bucket: process.env.AWS_S3_BUCKET!,
	});

	await s3.send(uploadCommand);
};

const uploadFromBuffer = async (buffer: Buffer, destinationPath: string) => {
	const upload = new Upload({
		client: s3,
		params: {
			Key: destinationPath,
			Bucket: process.env.AWS_S3_BUCKET!,
			Body: createStreamFromBuffer(buffer),
		},
	});

	await upload.done();
};

const uploadFileToBucket: StorageUploadFn = async (pathOrBuffer, destinationPath) => {
	return typeof pathOrBuffer === 'string'
		? uploadFromPath(pathOrBuffer, destinationPath)
		: uploadFromBuffer(pathOrBuffer, destinationPath);
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

export const getFileFromBucket: GetFileFn = async (path) => {
	const object = await s3.getObject({
		Key: path,
		Bucket: process.env.AWS_S3_BUCKET!,
	});
	
	// TODO: Fix
	return object.Body as ReadableStream;
}

export const storageProvider: StorageProvider = {
	upload: uploadFileToBucket,
	delete: deleteFromBucket,
	exists: objectExistsInBucket,
	get: getFileFromBucket,
	getFolderSeparator: () => '/',
};
