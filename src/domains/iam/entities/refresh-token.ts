import cryptoRandomString from 'crypto-random-string';

import { addTimeToDate } from '@libs/utils/date';

export type RefreshToken = {
	value: string,
	ttl: number,
	userId: string,

	// `creationDate` is undefined when it is not saved in the database
	creationDate?: Date,
};

// Two weeks in seconds
export const REFRESH_TOKEN_EXPIRATION = 1.21e6;

export const generateRefreshTokenForUser = (userId: string): RefreshToken => {
	return {
		value: cryptoRandomString({
			length: 16,
		}),
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

	return expirationDate.getTime() < date.getTime();
}
