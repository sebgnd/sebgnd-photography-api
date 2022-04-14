
import exifr from 'exifr';
import express, { Request, Response } from 'express';

import { app } from '../../../application';

import { isJpg, isPng } from '../../../libs/file/mimetype';

import { doesCategoryWithNameExist, findCategory, addImagesToCategory } from '../database/category/category.repository';
import { findImage, findImagePaginated, getTotalImages, saveImage } from '../database/image/image.repository';

export const imageController = express.Router();

/**
 * TODO:
 * Move some of that logic into entities, services
 */

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
			categoryId: img.categoryId,
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
					category: 'A gallery must be provided',
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
				message: 'The gallery does not exist',
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

			// Can be replace by a saveMany ?
			const savedImage = await saveImage({
				categoryId,
				exif: imageExif
					? {
						iso: imageExif.ISO,
						shutterSpeed: imageExif.ShutterSpeedValue.toString(),
						aperture: imageExif.ApertureValue.toString(),
						focalLength: imageExif.FocalLength.toString(),
					}
					: undefined,
			});
			
			return {
				saved: savedImage,
				name: name as string,
				filepath: filepath as string,
			};
		})
	);

	await addImagesToCategory(category.id!, images.map((img) => img.saved.id!));

	app.emit('images-uploaded', {
		images: images.map(({ saved, filepath, name }) => ({
			id: saved.id,
			originalName: name,
			temporaryPath: filepath,
		})),
	});

	return res.status(201).json({
		items: images.map(({ saved: img }) => ({
			id: img.id,
			createdAt: img.createdAt,
			updatedAt: img.updatedAt,
		}))
	})
});
