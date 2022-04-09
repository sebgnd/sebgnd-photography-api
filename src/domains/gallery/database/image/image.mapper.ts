import { BusinessEntityMapperFn, Mapper, OrmEntityMapperFn } from '../../../../database/utils/mapper/mapper';

import { ImageModel, ImageOrmEntity } from '../../../../database/entities/image'
import { Image } from '../../../gallery/types';

const fromOrmEntity: OrmEntityMapperFn<ImageOrmEntity, Image> = (image: ImageOrmEntity): Image => ({
	id: image._id,
	exif: image.exif
		? {
			iso: image.exif.iso,
			aperture: image.exif.aperture,
			focalLength: image.exif.focalLength,
			shutterSpeed: image.exif.shutterSpeed,
		}
		: undefined,
	createdAt: new Date(image.createdAt),
  	updatedAt: new Date(image.updatedAt),
});

const fromBusinessEntity: BusinessEntityMapperFn<Image, ImageOrmEntity> = (image: Image) => {
	const ormImage = new ImageModel();

	return ormImage as ImageOrmEntity;
}

export const imageMapper: Mapper<ImageOrmEntity, Image> = {
	fromOrmEntity,
	fromBusinessEntity,
}
