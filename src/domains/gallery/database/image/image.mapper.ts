import { Types } from 'mongoose';

import { BusinessEntityMapperFn, Mapper, OrmEntityMapperFn } from '../../../../database/utils/mapper/mapper';

import { ImageModel, ImageOrmEntity } from '../../../../database/entities/image'
import { Image } from '../../../gallery/types';

const fromOrmEntity: OrmEntityMapperFn<ImageOrmEntity, Image> = (image: ImageOrmEntity): Image => {
	const imageType = image.dimension?.height >= image.dimension?.width
		? 'portrait'
		: 'landscape';

	return {
		id: image._id,
		exif: image.exif
			? {
				iso: image.exif.iso,
				aperture: image.exif.aperture,
				focalLength: image.exif.focalLength,
				shutterSpeed: image.exif.shutterSpeed,
			}
			: null,
		type: image.dimension ? imageType : undefined,
		createdAt: new Date(image.createdAt),
		updatedAt: new Date(image.updatedAt),
		categoryId: image.category.toString(),
	}
};

const fromBusinessEntity: BusinessEntityMapperFn<Image, ImageOrmEntity> = (image: Image) => {
	const ormImage = new ImageModel() as ImageOrmEntity;

	if (image.id) {
		ormImage._id = image.id;
		ormImage.createdAt = image.createdAt!.toString();
		ormImage.updatedAt = image.updatedAt!.toString();
	}

	ormImage.category = new Types.ObjectId(image.categoryId);
	ormImage.exif = image.exif
		? {
			iso: image.exif.iso,
			shutterSpeed: image.exif.shutterSpeed,
			aperture: image.exif.aperture,
			focalLength: image.exif.focalLength,
		}
		: undefined;

	return ormImage as ImageOrmEntity;
}

export const imageMapper: Mapper<ImageOrmEntity, Image> = {
	fromOrmEntity,
	fromBusinessEntity,
}
