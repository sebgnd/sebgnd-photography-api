import mongoose, { Schema, Types } from 'mongoose';

import { CATEGORY_SCHEMA_NAME, IMAGE_SCHEMA_NAME } from '../constant';
import { OrmEntity } from '../types';

interface Image {
	exif?: {
		iso: number,
		shutterSpeed: number,
		aperture: number,
		focalLength: number,
	};
	dimension: {
		width: number,
		height: number,
	},
	processing: boolean,
	category: Types.ObjectId,
}

const imageSchema = new Schema<Image>({
	exif: {
		required: false,
		type: {
			iso: Number,
			shutterSpeed: String,
			aperture: String,
			focalLength: String,
		},
	},
	dimension: {
		required: false,
		type: {
			width: Number,
			height: Number,
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
