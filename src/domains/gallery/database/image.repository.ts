import { ImageOrmModel } from '@database/entities/image.orm';

import { Image } from '@domains/gallery/entities/image.entity';

export type ImageRepository = {
  findImage: (id: string) => Promise<Image | null>,
  findImagePaginated: (parameters: PaginationParameters) => Promise<Image[]>,
  saveImage: (image: Image) => Promise<Image>,
  getTotalImages: (status: string, categoryId?: string) => Promise<Number>,
  deleteImage: (id: string) => Promise<void>,
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

export const imageRepository: ImageRepository = {
  findImage: async (id: string) => {
    const image = await ImageOrmModel.findById(id);
    if (!image) {
      return null;
    }
    return image.toJSON<Image>();
  },

  findImagePaginated: async ({ limit, offset, categoryId, status }) => {
    const images = await ImageOrmModel
      .find(
        getFilterOptions(status, categoryId),
      )
      .skip(offset)
      .limit(limit)
      .sort({
        updatedAt: 'desc',
      });

    return images.map((image) => image.toJSON<Image>());
  },

  saveImage: async (image) => {
    const ormImage = new ImageOrmModel(image);
    const savedImage = await ormImage.save();
    return savedImage.toJSON<Image>();
  },

  getTotalImages: async (status, categoryId) => {
    const total = await ImageOrmModel.count(
      getFilterOptions(status, categoryId),
    );
    return total;
  },

  deleteImage: async (id) => {
    await ImageOrmModel.deleteOne({ _id: id });
  },
};
