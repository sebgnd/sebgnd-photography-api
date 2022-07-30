import mongoose, { Schema, Types } from 'mongoose';

import { CATEGORY_SCHEMA_NAME, IMAGE_SCHEMA_NAME } from '../constant';
import { OrmEntity } from '../types';

type ImageStatus = 'processing' | 'valid' | 'error';
type Image = {
  exif?: {
    iso: number,
    shutterSpeed: string,
    aperture: string,
    focalLength: string,
  };
  dimension: {
    width: number,
    height: number,
  },
  status: ImageStatus,
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
  status: {
    type: String,
    enum: ['processing', 'valid', 'error'],
    required: true,
    default: 'processing',
  },
}, { timestamps: true });

export const ImageModel = mongoose.model(IMAGE_SCHEMA_NAME, imageSchema);

export type ImageOrmEntity = OrmEntity<Image>;
