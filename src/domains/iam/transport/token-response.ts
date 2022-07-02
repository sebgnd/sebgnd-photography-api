import { Response } from 'express';
import { RefreshToken } from '@domains/iam/entities/refresh-token';
import { addTimeToDate } from '@libs/utils/date';

export type TokenToSend = {
	authorizationToken: string,
	refreshToken: RefreshToken,
};

export const REFRESH_TOKEN_COOKIE = '__Secure-refreshToken';

export const safelySendToken = (res: Response, tokens: TokenToSend) => {
	const { authorizationToken, refreshToken } = tokens;

	res.cookie(REFRESH_TOKEN_COOKIE, refreshToken.value, {
		expires: addTimeToDate(new Date(), {
			seconds: refreshToken.ttl,
		}),
		secure: true,
		httpOnly: true,
		sameSite: true,
	});
	res.status(200).json({
		token: authorizationToken,
	});
};