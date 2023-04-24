import { ImageOrmModel } from '@database/entities/image.orm';

export type Dimension = {
  width: number,
  height: number,
};

export type ProcessedImageRepository = {
  saveProcessedData: (id: string, processing: boolean, dimension: Dimension) => Promise<void>,
};

export const processedImageRepository: ProcessedImageRepository = {
  saveProcessedData: async (id, processing, dimension) => {
    const { width, height } = dimension;
    const image = await ImageOrmModel.findByIdAndUpdate(id, {
      status: processing ? 'processing' : 'valid',
      dimension: {
        width,
        height,
      },
    });

    if (!image) {
      throw new Error('Cannot find image');
    }
  },
};
