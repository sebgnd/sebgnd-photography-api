
import { createController } from '@libs/famework/controller';
import { Locality } from '@libs/famework/events/dispatcher';

import { authorization } from '@domains/iam/middleware/authorization.middleware';

import { doesCategoryExist, findCategory, addImageToCategory, removeImageFromCategory } from '@domains/gallery/database/category/category.repository';
import { findImage, findImagePaginated, getTotalImages, saveImage, deleteImage } from '@domains/gallery/database/image/image.repository';

import { isImageThumbnail } from '@domains/gallery/entities/category.entity';
import { createImageFromFile } from '@domains/gallery/entities/image.entity';

import { upload } from '@root/application';

const AVAILABLE_STATUS = ['all', 'valid', 'processing', 'error'];

export const imageController = createController('images', ({ builder, eventDispatcher }) => {
	builder
		.get('/', {
			handler: async (req, res) => {
				const { limit, offset, category } = req.query;
				const imageStatus = req.query.status?.toString() || 'all';

				if (limit === undefined || offset == undefined || !AVAILABLE_STATUS.includes(imageStatus)) {
					res.status(400).json({
						error: {
							offset: 'offset is required and must be a number',
							limit: 'limit is required and must be a number',
							status: 'status must be one of the following values: all, valid, processing, error',
						}
					});

					return;
				}
			
				if (category) {
					const categoryExists = await doesCategoryExist(category.toString());
			
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
					findImagePaginated({
						limit: parsedLimit,
						offset: parseOffset,
						categoryId: category?.toString(),
						status: imageStatus, 
					}),
					getTotalImages(imageStatus, category?.toString()),
				]);
			
				res.status(200).json({
					items: images.map((img) => ({
						id: img.id,
						categoryId: img.categoryId,
						type: img.type,
						createdAt: img.createdAt,
						updatedAt: img.updatedAt,
						status: img.status,
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
			middlewares: [
				upload.single('image'),
				// authorization(),
			],
			handler: async (req, res) => {
				const { body, file } = req;

				if (!file || !body.categoryId) {
					res.status(400).json({
						error: {
							message: 'Invalid form data for uploading image',
							details: {
								category: 'A category must be provided',
								image: 'You must provided the image to be uploaded'
							}
						},
					});

					return;
				}

				const categoryId = body.categoryId as string;
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

				const { error, image: createdImage } = await createImageFromFile(file, categoryId);

				if (error) {
					/**
					 * Only handles incorrect mimetype for now.
					 */
					res.status(400).json({
						error: {
							message: 'Invalid image',
							details: {
								mimetype: error.message,
							}
						},
					});

					return;
				}

				const savedImage = await saveImage(createdImage!);

				await addImageToCategory(categoryId, savedImage.id!);

				eventDispatcher.dispatch({
					name: 'images:uploaded',
					locality: Locality.INTERNAL,
					data: {
						image: {
							id: savedImage.id?.toString(),
							originalName: createdImage!.temporaryFile!.name,
							temporaryPath: createdImage!.temporaryFile!.path,
						},
					},
				});

				res.status(201).json({
					item: {
						id: savedImage.id?.toString(),
						createdAt: savedImage.createdAt,
						updatedAt: savedImage.updatedAt,
						status: savedImage.status,
					},
				})
			}
		})
		.delete(':id', {
			middlewares: [
				authorization(),
			],
			handler: async (req, res) => {
				const { id } = req.params;

				const image = await findImage(id);

				if (!image) {
					res.status(404).json({
						error: {
							message: 'Image not found',
						},
					});

					return;
				}

				const category = await findCategory(image.categoryId);

				if (isImageThumbnail(category, id)) {
					res.status(400).json({
						error: {
							message: 'Cannot delete an image used as a thumbnail',
							details: {
								imageId: id,
								thumbnailCategoryId: category?.id,
							},
						},
					});

					return;
				}

				await Promise.all([
					deleteImage(id),
					removeImageFromCategory(category!.id!, id),
				]);

				eventDispatcher.dispatch({
					name: 'images:deleted',
					locality: Locality.INTERNAL,
					data: {
						image: { id },
					},
				});

				res.status(200).json({ id })
			},
		})
});