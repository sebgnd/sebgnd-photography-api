import mongoose, { Schema } from 'mongoose';

import { CATEGORY_SCHEMA_NAME, IMAGE_SCHEMA_NAME } from '../constant';
import { OrmEntity } from '../types';

interface Exif {
	iso: number;
	shutterSpeed: number;
	aperture: number;
	focalLength: number;
}

interface Image {
	exif?: Exif;
	processing: boolean,
	category: Schema.Types.ObjectId,
}

const imageSchema = new Schema<Image>({
	exif: {
		type: {
			iso: Number,
			shutterSpeed: String,
			aperture: String,
			focalLength: String,
		},
	},
	category: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: CATEGORY_SCHEMA_NAME,
	},
	processing: {
		type: Boolean,
		required: true,
	}
}, { timestamps: true });

export const ImageModel = mongoose.model(IMAGE_SCHEMA_NAME, imageSchema);

export type ImageOrmEntity = OrmEntity<Image>;
