
import { readExifFromImage } from '@libs/file/exif';
import { createController } from '../../../libs/famework/controller';

import { filterFileByMimetype, Mimetype } from '../../../libs/file/mimetype';

import { doesCategoryWithNameExist, findCategory, addImagesToCategory } from '../database/category/category.repository';
import { findImage, findImagePaginated, getTotalImages, saveManyImages } from '../database/image/image.repository';
import { Image } from '../types';

/**
 * TODO:
 * Move some of that logic into entities, services
 */
export const imageController = createController('images', ({ builder }) => {
	builder
		.get('/', {
			handler: async (req, res) => {
				const { limit, offset, category } = req.query;

				if (limit === undefined || offset == undefined) {
					res.status(400).json({
						error: {
							message: 'Your must provide `offset` and `limit`',
						}
					});

					return;
				}
			
				if (category) {
					const categoryExists = await doesCategoryWithNameExist(category.toString());
			
					if (!categoryExists) {
						res.status(400).json({
							error: {
								message: 'Category does not exist',
								details: {
									requestedCategory: category,
								},
							},
						});

						return;
					}
				}
			
				const parsedLimit = parseInt(limit.toString());
				const parseOffset = parseInt(offset.toString());
				
				const [images, total] = await Promise.all([
					findImagePaginated(parsedLimit, parseOffset, category?.toString()),
					getTotalImages(),
				]);
			
				res.status(200).json({
					items: images.map((img) => ({
						id: img.id,
						categoryId: img.categoryId,
						type: img.type,
						createdAt: img.createdAt,
						updatedAt: img.updatedAt,
					})),
					total,
					limit: parsedLimit,
					offset: parseOffset,
				});
			}
		})
		.get('/:id', {
			handler: async (req, res) => {
				const { id } = req.params;
				const image = await findImage(id);
			
				res.status(200).json({
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
			}
		})
		.post('/', {
			handler: async (req, res) => {
				const { files, fields } = req;

				if (!files || !fields || !fields.categoryId || Array.isArray(fields.categoryId) || (files && !files.images)) {
					res.status(400).json({
						error: {
							message: 'Invalid form data for uploading images',
							details: {
								category: 'A gallery must be provided',
								images: 'You must provided the images to be uploaded'
							}
						},
					});

					return;
				}

				if (!Array.isArray(files.images)) {
					res.status(400).json({
						error: {
							message: 'You must provide the `images` array in the form data',
						},
					});

					return;
				}

				const { categoryId } = fields;
				const category = await findCategory(categoryId);

				if (!category) {
					res.status(400).json({
						error: {
							message: 'The gallery does not exist',
							details: { categoryId }
						},
					});

					return;
				}

				const fileImagesOnly = filterFileByMimetype(files.images, [
					Mimetype.JPG,
					Mimetype.PNG,
				]);

				const images: Image[] = await Promise.all(
					fileImagesOnly.map(async (image) => {
						const { name, filepath } = image as any;
						const exif = await readExifFromImage(image);

						return {
							categoryId,
							exif,
							temporaryFile: {
								path: filepath,
								name,
							},
						}
					})
				);
				const savedImages = await saveManyImages(images);

				await addImagesToCategory(category.id!, savedImages.map((img) => img.id!));

				// TODO: Call this through an event dispatched in the controller callback
				// app.instance.emit('images-uploaded', {
				// 	images: images.map(({ saved, filepath, name }) => ({
				// 		id: saved.id,
				// 		originalName: name,
				// 		temporaryPath: filepath,
				// 	})),
				// });

				res.status(201).json({
					items: savedImages.map((img) => ({
						id: img.id,
						createdAt: img.createdAt,
						updatedAt: img.updatedAt,
					}))
				})
			}
		})
});