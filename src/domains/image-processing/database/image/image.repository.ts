import { ImageModel } from '@database/entities/image.orm';

export type Dimension = {
  width: number,
  height: number,
};

export const updateImageProcessedData = async (id: string, processing: boolean, dimension: Dimension) => {
  const { width, height } = dimension;

  const image = await ImageModel.findByIdAndUpdate(id, {
    status: processing ? 'processing' : 'valid',
    dimension: {
      width,
      height,
    },
  });

  if (!image) {
    throw new Error('Cannot find image');
  }
};
