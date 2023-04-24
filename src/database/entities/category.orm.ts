import mongoose, { Schema } from 'mongoose';

import { CategoryWithImagesAsIds } from '@domains/gallery/entities/category.entity';

import { IMAGE_SCHEMA_NAME } from './image.orm';

const categorySchema = new Schema<CategoryWithImagesAsIds>({
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
  }],
}, { timestamps: true });


export const CATEGORY_SCHEMA_NAME = 'category';
export const CategoryOrmModel = mongoose.model(CATEGORY_SCHEMA_NAME, categorySchema);
