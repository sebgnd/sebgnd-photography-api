import { ImageModel } from '../../../../database/entities/image';

export type Dimension = {
	width: number,
	height: number,
};

export const updateImageProcessedData = async (id: string, processing: boolean, dimension: Dimension) => {
	const { width, height } = dimension;

	const image = await ImageModel.findByIdAndUpdate(id, {
		processing,
		dimension: {
			width,
			height,
		},
	});

	if (!image) {
		throw new Error('Cannot find image');
	}
};
