
import { readExifFromImage } from '../../../libs/file/exif';
import { createController } from '../../../libs/famework/controller';
import { Locality } from '../../../libs/famework/event-dispatcher';
import { filterFileByMimetype, Mimetype } from '../../../libs/file/mimetype';

import { doesCategoryWithNameExist, findCategory, addImagesToCategory } from '../database/category/category.repository';
import { findImage, findImagePaginated, getTotalImages, saveManyImages } from '../database/image/image.repository';
import { Image } from '../types';

export const imageController = createController('images', ({ builder, eventDispatcher }) => {
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

				const fileImagesOnly = filterFileByMimetype(
					files.images.map((file) => {
						return { ...file, mimetype: (file as any).type };
					}),
					[Mimetype.JPG, Mimetype.PNG]
				);

				const images: Image[] = await Promise.all(
					fileImagesOnly.map(async (image) => {
						const { name, path } = image as any;
						const exif = await readExifFromImage(image as any);

						return {
							categoryId,
							exif,
							temporaryFile: {
								path,
								name,
							},
						}
					})
				);

				const savedImages = await saveManyImages(images);

				await addImagesToCategory(category.id!, savedImages.map((img) => img.id!));

				const imagesForEvent = images.map(({ temporaryFile }, index) => ({
					id: savedImages[index].id?.toString(),
					originalName: temporaryFile!.name,
					temporaryPath: temporaryFile!.path,
				}));

				eventDispatcher.dispatch({
					name: 'images:uploaded',
					locality: Locality.INTERNAL,
					data: {
						images: imagesForEvent,
					},
				});

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