import mongoose, { Schema, Types } from 'mongoose';

import { AUTHORIZED_USER_SCHEMA_NAME } from '../constant';
import { OrmEntity } from '../types';

type AuthorizedUser = {
	sso: {
		providerUserId: string,
		provider: string,
	},
}

const authorizedUserSchema = new Schema<AuthorizedUser>({
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

export const AuthorizedUserModel = mongoose.model(AUTHORIZED_USER_SCHEMA_NAME, authorizedUserSchema);

export type AuthorizedUserOrmEntity = OrmEntity<AuthorizedUser>;
