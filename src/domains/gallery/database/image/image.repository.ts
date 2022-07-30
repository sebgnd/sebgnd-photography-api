import { ImageModel, ImageOrmEntity } from '@database/entities/image';

import { imageMapper } from '@domains/gallery/database/image/image.mapper';

import { Image } from '@domains/gallery/entities/image.entity';

export const findImage = async (id: string) => {
  const image = await ImageModel.findById(id);

  return imageMapper.fromOrmEntity(image as ImageOrmEntity);
};

export type PaginationParameters = {
  limit: number,
  offset: number,
  status: string,
  categoryId?: string,
}

export const getFilterOptions = (status: string, categoryId?: string) => {
  return {
    ...(categoryId ? { category: categoryId } : {}),
    ...(status !== 'all' ? { status } : {}),
  };
};

export const findImagePaginated = async ({ limit, offset, categoryId, status }: PaginationParameters) => {
  const images = await ImageModel
    .find(
      getFilterOptions(status, categoryId),
    )
    .skip(offset)
    .limit(limit)
    .sort({
      updatedAt: 'desc',
    });

  return images.map((img) => imageMapper.fromOrmEntity(img as ImageOrmEntity));
};

export const saveImage = async (image: Image) => {
  const ormEntity = imageMapper.fromBusinessEntity(image);
  const savedEntity = await ormEntity.save();

  return imageMapper.fromOrmEntity(savedEntity as ImageOrmEntity);
};

export const getTotalImages = async (status: string, categoryId?: string) => {
  return ImageModel.count(
    getFilterOptions(status, categoryId),
  );
};

export const deleteImage = async (id: string) => {
  await ImageModel.deleteOne({ _id: id });
};
