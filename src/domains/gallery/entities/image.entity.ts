import { PersistedEntity } from '@libs/types';

import { readExifFromImage } from '@libs/file/exif';
import { isFileMimetype, Mimetype } from '@libs/file/mimetype';

export type Exif = {
  iso: number;
  shutterSpeed: string;
  aperture: string;
  focalLength: string;
}

export type File = {
  path: string,
  mimetype: string,
  originalname: string,
}

export type Image = PersistedEntity & {
  exif: Exif | null;
  type?: 'portrait' | 'landscape',
  categoryId: string,
  status?: 'processing' | 'valid' | 'error',
  temporaryFile?: {
    name: string,
    path: string,
  },
};

export type ImageCreationError = {
  message: string,
  type: 'invalid-image',
};

export type ImageCreationResult =
  | { image: undefined, error: ImageCreationError }
  | { image: Image, error: undefined };

export const createImageFromFile = async (file: File, categoryId: string): Promise<ImageCreationResult> => {
  const isFileCorrectMimetype = isFileMimetype(file, [
    Mimetype.JPG,
    Mimetype.PNG,
  ]);

  if (!isFileCorrectMimetype) {
    return {
      image: undefined,
      error: {
        type: 'invalid-image',
        message: 'You must provide a JPG or PNG image',
      },
    };
  }

  const exif = await readExifFromImage({
    path: file.path,
  });

  return {
    error: undefined,
    image: {
      categoryId,
      exif,
      temporaryFile: {
        path: file.path,
        name: file.originalname,
      },
    },
  };
};
