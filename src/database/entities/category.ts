import mongoose, { Schema } from 'mongoose';

import { CATEGORY_SCHEMA_NAME, IMAGE_SCHEMA_NAME } from '../constant';
import { OrmEntity } from '..//types';

import { ImageOrmEntity } from './image';

interface CategoryThumbnail {
 	id: string,
}

interface Category {
	name: string;
	formattedName: string;
	thumbnail?: CategoryThumbnail;
	images?: (Schema.Types.ObjectId | ImageOrmEntity)[],
}

const categorySchema = new Schema<Category>({
	name: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
	},
	formattedName: {
		type: String,
		required: true,
		unique: true,
	},
	thumbnail: {
		default: null,
		type: {
			id: Schema.Types.ObjectId,
		},
	},
	images: [{
		type: Schema.Types.ObjectId,
		ref: IMAGE_SCHEMA_NAME,
	}]
}, { timestamps: true });

export type CategoryOrmEntity = OrmEntity<Category>;

export const CategoryModel = mongoose.model(CATEGORY_SCHEMA_NAME, categorySchema);
