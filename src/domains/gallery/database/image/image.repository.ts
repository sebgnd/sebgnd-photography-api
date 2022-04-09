import { ImageModel, ImageOrmEntity } from '../../../../database/entities/image';

import { imageMapper } from '../../database/image/image.mapper';

export const findImage = async (id: string) => {
  const image = await ImageModel.findById(id);

  console.log(image);

  return imageMapper.fromOrmEntity(image as ImageOrmEntity);
}

export const findImagePaginated = async (limit: number, offset: number) => {
	const images = await ImageModel
		.find()
		.skip(offset)
		.limit(limit)
		.sort({
			updatedAt: 'desc',
		});

	return images.map((img) => imageMapper.fromOrmEntity(img as ImageOrmEntity));
}

export const getTotalImages = async () => ImageModel.count();
