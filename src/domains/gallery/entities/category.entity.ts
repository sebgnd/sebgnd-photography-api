import { Types } from 'mongoose';

import { Entity } from '@libs/entity';

import { Image } from '@domains/gallery/entities/image.entity';

export type Category = Entity & {
  name: string,
  formattedName: string,
  thumbnail: null | {
    id: Types.ObjectId,
  },
};

export type CategoryWithImagesAsIds = Category & {
  images: Types.ObjectId[],
}

export type CategoryWithImages = Category & {
  images: Image[],
};

export const doesImageBelongToCategory = (category: Category, image: Image) => {
  return image.category.toString() === category.id?.toString();
};

export const isImageThumbnail = (category: Category, imageId: string) => {
  return category.thumbnail?.id.toString() === imageId;
};
