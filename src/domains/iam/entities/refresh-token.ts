import * as crypto from 'crypto';
import * as util from 'util';

import { addTimeToDate } from '@libs/utils/date';

const randomBytes = util.promisify(crypto.randomBytes);

export type RefreshToken = {
	value: string,
	ttl: number,
	userId: string,

	// `creationDate` is undefined when it is not saved in the database
	creationDate?: Date,
};

// Two weeks in seconds
export const REFRESH_TOKEN_EXPIRATION = 1.21e6;

export const generateRefreshTokenForUser = async (userId: string): Promise<RefreshToken> => {
	const bytes = await randomBytes(16);

	return {
		value: bytes.toString('hex'),
		ttl: REFRESH_TOKEN_EXPIRATION,
		creationDate: new Date(),
		userId,
	};
};

export const isRefreshTokenValid = (refreshToken: RefreshToken, date: Date) => {
	if (!refreshToken.creationDate) {
		return false;
	}

	const expirationDate = addTimeToDate(refreshToken.creationDate, {
		seconds: refreshToken.ttl,
	});

	return expirationDate.getTime() > date.getTime();
}
