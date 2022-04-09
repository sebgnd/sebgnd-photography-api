import { CategoryModel } from '../../../../database/entities/category';
import { ImageModel, ImageOrmEntity } from '../../../../database/entities/image';

import { imageMapper } from '../../database/image/image.mapper';

export const findImage = async (id: string) => {
  const image = await ImageModel.findById(id);

  return imageMapper.fromOrmEntity(image as ImageOrmEntity);
}

export const findImagePaginated = async (limit: number, offset: number, categoryName?: string) => {
	const categoryWithName = await CategoryModel.findOne({ name: categoryName });

	if (categoryName && !categoryWithName) {
		return [];
	}

	const images = await ImageModel
		.find(
			categoryName
				? { category:  categoryWithName!.id }
				: {}
		)
		.skip(offset)
		.limit(limit)
		.sort({
			updatedAt: 'desc',
		});

	return images.map((img) => imageMapper.fromOrmEntity(img as ImageOrmEntity));
}

export const getTotalImages = async () => ImageModel.count();
