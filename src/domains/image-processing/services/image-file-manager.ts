import { storageProvider } from './storage-provider';

export type ImageFormat = 'thumbnail' | 'full';
export type ImageSize = '400' | '1080' | '80' | 'original';

export const availableFormats: ImageFormat[] = ['thumbnail', 'full'];
export const availableSizes: ImageSize[] = ['400', '1080', '80', 'original'];

export type ImagePathConfig = {
  format: ImageFormat,
  size: ImageSize,
};

export const validFormatAndSize = (format: string, size: string) => {
  return availableFormats.includes(format as any) || availableSizes.includes(size as any);
};

export const buildImagePath = (imageId: string, format: ImageFormat, size: ImageSize) => {
  const parts = [format, size, imageId];
  const partsWithSeparator = parts.join(storageProvider.getFolderSeparator());

  return `${partsWithSeparator}.jpg`;
};

export const saveOriginalImage = async (id: string, path: string) => {
  await storageProvider.upload(path, buildImagePath(id, 'full', 'original'));
};

export const saveThumbnailImage = async (id: string, height: number, buffer: Buffer) => {
  await storageProvider.upload(
    buffer,
    buildImagePath(id, 'thumbnail', height.toString() as ImageSize),
  );
};

export const saveFullImage = async (id: string, height: number, buffer: Buffer) => {
  await storageProvider.upload(
    buffer,
    buildImagePath(id, 'full', height.toString() as ImageSize),
  );
};

export const getImagePathIfExist = async (imageId: string, config: ImagePathConfig) => {
  const { format, size } = config;

  const imagePath = buildImagePath(imageId, format, size);
  const imagePathExist = await storageProvider.exists(imagePath);

  if (imagePathExist) {
    return imagePath;
  }

  return null;
};

export const deleteImage = async (imageId: string) => {
  await Promise.all(
    availableFormats.reduce((acc, format) => {
      return [...acc, ...availableSizes.map(async (size) => {
        console.log(`APPLICATION | Deleting ${format}/${size} of ${imageId}`);

        const imagePath = buildImagePath(imageId, format, size);
        const imageExist = await storageProvider.exists(imagePath);

        if (imageExist) {
          await storageProvider.delete(imagePath);
        }
      })];
    }, [] as Promise<void>[]),
  );
};
