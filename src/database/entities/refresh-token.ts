import mongoose, { ObjectId, Schema } from 'mongoose';

import { AUTHORIZED_USER_SCHEMA_NAME, REFRESH_TOKEN_SCHEMA_NAME } from '../constant';
import { OrmEntity } from '../types';

type RefreshToken = {
	token: string,
	userId: ObjectId,
	ttl: number,
};

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

export const RefreshTokenModel = mongoose.model(REFRESH_TOKEN_SCHEMA_NAME, refreshTokenSchema);

export type RefreshTokenOrmEntity = OrmEntity<RefreshToken>;
