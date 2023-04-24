import { Types } from 'mongoose';

import { Entity } from '@libs/entity';

import { readExifFromImage } from '@libs/file/exif';
import { isFileMimetype, Mimetype } from '@libs/file/mimetype';

export const IMAGE_STATUSES = ['processing', 'valid', 'error'] as const;

export type ImageStatus = typeof IMAGE_STATUSES[number];
export type ImageType = 'landscape' | 'portrait';
export type Exif = {
  iso: number,
  shutterSpeed: string,
  aperture: string,
  focalLength: string,
};
export type Dimension = {
  width: number,
  height: number,
};
export type Image = Entity & {
  exif: Exif | null;
  dimension: Dimension | null,
  status: ImageStatus,
  category: Types.ObjectId,
  type: ImageType | null,
}

type File = {
  path: string,
  mimetype: string,
  originalname: string,
};

export const createImageFromFile = async (file: File, categoryId: string) => {
  const isFileCorrectMimetype = isFileMimetype(file, [
    Mimetype.JPG,
    Mimetype.PNG,
  ]);

  if (!isFileCorrectMimetype) {
    return null;
  }

  const exif = await readExifFromImage({
    path: file.path,
  });

  const image: Image = {
    dimension: null,
    status: 'processing',
    category: new Types.ObjectId(categoryId),
    type: null,
    exif,
  };

  return {
    temporaryFile: {
      path: file.path,
      name: file.originalname,
    },
    image,
  };
};
