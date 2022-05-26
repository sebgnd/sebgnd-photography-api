import { CategoryModel } from '@database/entities/category';
import { ImageModel, ImageOrmEntity } from '@database/entities/image';

import { imageMapper } from '@domains/gallery/database/image/image.mapper';

import { Image } from '@domains/gallery/types';

export const findImage = async (id: string) => {
  const image = await ImageModel.findById(id);

  return imageMapper.fromOrmEntity(image as ImageOrmEntity);
}

export const findImagePaginated = async (limit: number, offset: number, categoryId?: string) => {
	const images = await ImageModel
		.find(
			categoryId
				? { category: categoryId }
				: {}
		)
		.skip(offset)
		.limit(limit)
		.sort({
			updatedAt: 'desc',
		});

	return images.map((img) => imageMapper.fromOrmEntity(img as ImageOrmEntity));
}

export const saveManyImages = async (images: Image[]) => {
	const ormEntities = images.map(imageMapper.fromBusinessEntity);
	const savedEntities = await ImageModel.insertMany(ormEntities);

	return savedEntities.map((img) => imageMapper.fromOrmEntity(img as ImageOrmEntity));
}

export const getTotalImages = async (categoryId?: string) => ImageModel.count(
	categoryId
		? { category: categoryId }
		: {}
);
