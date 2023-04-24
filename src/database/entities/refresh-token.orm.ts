import mongoose, { Schema } from 'mongoose';

import { RefreshToken } from '@domains/iam/entities/refresh-token.entity';
import { AUTHORIZED_USER_SCHEMA_NAME } from '@database/entities/user.orm';

const refreshTokenSchema = new Schema<RefreshToken>({
  token: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: AUTHORIZED_USER_SCHEMA_NAME,
  },
  ttl: {
    type: Number,
    require: true,
  },
}, { timestamps: true });

export const REFRESH_TOKEN_SCHEMA_NAME = 'refresh_token';
export const RefreshTokenOrmModel = mongoose.model(REFRESH_TOKEN_SCHEMA_NAME, refreshTokenSchema);
