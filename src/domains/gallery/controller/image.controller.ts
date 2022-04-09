import exifr from 'exifr';
import express, { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

import { isJpg, isPng } from '../../../libs/file/mimetype';

import { doesCategoryWithNameExist, findCategory } from '../database/category/category.repository';
import { findImage, findImagePaginated, getTotalImages, saveImage } from '../database/image/image.repository';
import { Image } from '../types';

export const imageController = express.Router();

imageController.get('/', async (req: Request, res: Response) => {
	const { limit, offset, category } = req.query;

	if (limit === undefined || offset == undefined) {
		return res.status(400).json({
			error: {
				message: 'Your must provide `offset` and `limit`',
			}
		});
	}

	if (category) {
		const categoryExists = await doesCategoryWithNameExist(category.toString());

		if (!categoryExists) {
			return res.status(400).json({
				error: {
					message: 'Category does not exist',
					details: {
						requestedCategory: category,
					},
				},
			});
		}
	}

	const parsedLimit = parseInt(limit.toString());
	const parseOffset = parseInt(offset.toString());

	const images = await findImagePaginated(parsedLimit, parseOffset, category?.toString());
	const total = await getTotalImages();

	return res.status(200).json({
		items: images.map((img) => ({
			id: img.id,
			createdAt: img.createdAt,
			updatedAt: img.updatedAt,
		})),
		total,
		limit: parsedLimit,
		offset: parseOffset,
	});
});


imageController.get('/:id', async (req: Request, res: Response) => {
	const { id } = req.params;
	const image = await findImage(id);

	return res.status(200).json({
		id: image.id,
		createdAt: image.createdAt,
		updatedAt: image.updatedAt,
		exif: image.exif
			? {
				iso: image.exif.iso,
				shutterSpeed: image.exif.shutterSpeed,
				focalLength: image.exif.focalLength,
				aperture: image.exif.aperture,
			}
			: null,
	});
});

imageController.post('/', async (req: Request, res: Response) => {
	const { files, fields } = req;

	if (!files || !fields || !fields.categoryId || Array.isArray(fields.categoryId) || (files && !files.images)) {
		return res.status(400).json({
			error: {
				message: 'Invalid form data for uploading images',
				details: {
					category: 'A category must be provided',
					images: 'You must provided the images to be uploaded'
				}
			},
		});
	}

	if (!Array.isArray(files.images)) {
		return res.status(400).json({
			error: {
				message: 'You must provide the `images` array in the form data',
			},
		});
	}

	const { categoryId } = fields;
	const category = await findCategory(categoryId);

	if (!category) {
		return res.status(400).json({
			error: {
				message: 'The category does not exist',
				details: { categoryId }
			},
		});
	}

	const fileImagesOnly = files.images.filter((file) => {
		return isPng((file as any).type) || isJpg((file as any).type);
	});

	const images = await Promise.all(
		fileImagesOnly.map(async ({ path: filepath, name }: any) => {
			const imageExif = await exifr.parse(filepath, [
				'ISO',
				'ShutterSpeedValue',
				'ApertureValue',
				'FocalLength',
			]);

			const savedImage = await saveImage({
				exif: imageExif.ISO
					? {
						iso: imageExif.ISO,
						shutterSpeed: imageExif.ShutterSpeedValue.toString(),
						aperture: imageExif.ApertureValue.toString(),
						focalLength: imageExif.FocalLength.toString(),
					}
					: undefined,
			}, categoryId);

			await new Promise((resolve, reject) => {
				const oldPath = filepath;
				const extension = path.extname(name);
				const newPath = `files/images/full_res/${savedImage.id}${extension}`;

				fs.copyFile(oldPath, newPath, (err) => {
					if (err) {
						reject(err);
					}

					resolve(undefined);
				});
			});
			
			return savedImage;
		})
	);

	return res.status(201).json({
		items: images.map((img) => ({
			id: img.id,
			createdAt: img.createdAt,
			updatedAt: img.updatedAt,
		}))
	})
});
