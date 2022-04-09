import app, { Request, Response } from 'express';

import { findAllCategories, findCategory } from '../database/category/category.repository';

export const categoryController = app.Router();

categoryController.get('/', async (req: Request, res: Response) => {
	const categories = await findAllCategories();

	res.status(200).json({
		items: categories.map((category) => {
			return {
				id: category.id,
				createdAt: category.createdAt,
				updatedAt: category.updatedAt,
				displayName: category.formattedName,
				name: category.name,
				thumbnail: {
					url: category.thumbnail ? category.thumbnail.url : null,
				},
			};
		})
	});
});

categoryController.get('/:id/images', async (req: Request, res: Response) => {
	const { id } = req.params;
	const category = await findCategory(id);

	return res.status(200).json({
		items: category.images?.map((img) => {
			return {
				id: img.id,
				createdAt: img.createdAt,
				updatedAt: img.updatedAt,
			};
		}) || [],
	});
});
