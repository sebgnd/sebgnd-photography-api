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

export const saveImage = async (image: Image) => {
	const ormEntity = imageMapper.fromBusinessEntity(image);
	const savedEntity = await ormEntity.save();

	return imageMapper.fromOrmEntity(savedEntity as ImageOrmEntity)
}

export const getTotalImages = async (categoryId?: string) => ImageModel.count(
	categoryId
		? { category: categoryId }
		: {}
);
