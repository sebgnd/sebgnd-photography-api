import * as fs from 'fs';
import { Readable } from 'stream';

import {
	S3,
	PutObjectCommand,
	DeleteObjectCommand,
	HeadObjectCommandInput,
	NotFound,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const bucketName = process.env.NODE_ENV === 'dev'
	? process.env.AWS_S3_BUCKET_DEV!
	: process.env.AWS_S3_BUCKET!;

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
export type GetFileFn = (path: string) => Promise<Readable>;
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
		Bucket: bucketName,
	});

	await s3.send(uploadCommand);
};

const uploadFromBuffer = async (buffer: Buffer, destinationPath: string) => {
	const upload = new Upload({
		client: s3,
		params: {
			Key: destinationPath,
			Bucket: bucketName,
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
		Bucket: bucketName,
		Key: path,
	});

	await s3.send(deleteCommand);
};

const objectExistsInBucket: StorageExistsFn = async (path) => {
	const params: HeadObjectCommandInput = {
		Key: path,
		Bucket: bucketName,
	};

	return new Promise((resolve, reject) => {
		s3.headObject(params, (err: unknown) => {
			if (err) {
				if (err instanceof NotFound) {
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
		Bucket: bucketName,
	});

	return object.Body as Readable;
}

export const storageProvider: StorageProvider = {
	upload: uploadFileToBucket,
	delete: deleteFromBucket,
	exists: objectExistsInBucket,
	get: getFileFromBucket,
	getFolderSeparator: () => '/',
};
