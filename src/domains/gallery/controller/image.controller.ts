
import { readExifFromImage } from '@libs/file/exif';
import { createController } from '@libs/famework/controller';
import { Locality } from '@libs/famework/event-dispatcher';
import { filterFileByMimetype, isFileMimetype, Mimetype } from '@libs/file/mimetype';

import { doesCategoryExist, findCategory, addImageToCategory } from '../database/category/category.repository';
import { findImage, findImagePaginated, getTotalImages, saveImage } from '../database/image/image.repository';

import { Image } from '../types';
import ExpressFormidable from 'express-formidable';

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
					findImagePaginated(parsedLimit, parseOffset, category?.toString()),
					getTotalImages(category?.toString()),
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

				if (!files || !fields || !fields.categoryId || Array.isArray(fields.categoryId) || (files && !files.image) || Array.isArray(files.image)) {
					res.status(400).json({
						error: {
							message: 'Invalid form data for uploading image',
							details: {
								category: 'A category must be provided',
								images: 'You must provided the image to be uploaded'
							}
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

				const isCorrectMimetype = isFileMimetype(files.image as any, [
					Mimetype.JPG,
					Mimetype.PNG,
				]);

				if (!isCorrectMimetype) {
					res.status(400).json({
						error: {
							message: 'Invalid image',
							details: {
								mimetype: 'You must provide a JPG or PNG image',
							}
						},
					});

					return;
				}

				/**
				 * Cast image as any because wrong typing library
				 * TODO: Update typing
				 */
				const uploadedImage = files.image as unknown as File;
				const exif = await readExifFromImage(uploadedImage as any);
				const image: Image = {
					categoryId,
					exif,
					temporaryFile: {
						path: (uploadedImage as any).path,
						name: uploadedImage.name,
					},
				}
				const savedImage = await saveImage(image);

				await addImageToCategory(category.id!, savedImage.id!);

				eventDispatcher.dispatch({
					name: 'images:uploaded',
					locality: Locality.INTERNAL,
					data: {
						image: {
							id: savedImage.id?.toString(),
							originalName: image.temporaryFile!.name,
							temporaryPath: image.temporaryFile!.path,
						},
					},
				});

				res.status(201).json({
					item: {
						id: savedImage.id?.toString(),
						createdAt: savedImage.createdAt,
						updatedAt: savedImage.updatedAt,
					},
				})
			}
		})
});