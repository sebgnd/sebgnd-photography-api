import mongoose, { Schema } from 'mongoose';

import { User } from '@domains/iam/entities/user.entity';

export const AUTHORIZED_USER_SCHEMA_NAME = 'authorized_user';

const authorizedUserSchema = new Schema<User>({
  sso: {
    required: false,
    type: {
      providerUserId: {
        type: String,
        index: true,
      },
      provider: String,
    },
  },
}, { timestamps: true });

export const AuthorizedUserOrmModel = mongoose.model(AUTHORIZED_USER_SCHEMA_NAME, authorizedUserSchema);

