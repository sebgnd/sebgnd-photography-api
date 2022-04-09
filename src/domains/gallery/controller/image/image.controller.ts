import express, { Request, Response } from 'express';

import { findImage, findImagePaginated, getTotalImages } from '../../database/image/image.repository';

export const imageController = express.Router();

imageController.get('/', async (req: Request, res: Response) => {
	const { limit, offset } = req.query;

	if (limit === undefined || offset == undefined) {
		return res.status(400).json({
			error: {
				message: 'Your must provide `offset` and `limit`',
			}
		})
	}

	const parsedLimit = parseInt(limit.toString());
	const parseOffset = parseInt(offset.toString());

	const images = await findImagePaginated(parsedLimit, parseOffset);
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