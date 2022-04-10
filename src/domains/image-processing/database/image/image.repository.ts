import { ImageModel } from '../../../../database/entities/image';

export const updateImageProcessing = async (id: string, processing: boolean) => {
	const image = await ImageModel.findById(id);

	if (!image) {
		throw new Error('Cannot find image');
	}

	image.processing = processing;

	await image.save();

	return processing;
};
