import mongoose, { Schema } from 'mongoose';

import {Image, IMAGE_STATUSES, ImageStatus, ImageType} from '@domains/gallery/entities/image.entity';

import { CATEGORY_SCHEMA_NAME } from '@database/entities/category.orm';

const imageSchema = new Schema<Image>({
  exif: {
    required: false,
    _id: false,
    type: {
      iso: Number,
      shutterSpeed: String,
      aperture: String,
      focalLength: String,
    },
  },
  dimension: {
    _id: false,
    type: {
      width: Number,
      height: Number,
    },
    default: {
      width: 0,
      height: 0,
    },
  },
  category: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: CATEGORY_SCHEMA_NAME,
  },
  status: {
    type: String,
    enum: IMAGE_STATUSES,
    required: true,
    default: 'processing',
  },
}, { timestamps: true });

imageSchema.virtual('type').get(function(): ImageType | null {
  if (!this.dimension) {
    return null;
  }

  return this.dimension.height > this.dimension.width ? 'portrait' : 'landscape';
});

export const IMAGE_SCHEMA_NAME = 'image';
export const ImageOrmModel = mongoose.model(IMAGE_SCHEMA_NAME, imageSchema);
