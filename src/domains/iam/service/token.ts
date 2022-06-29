import { sign, verify } from 'jsonwebtoken';

export type AuthorizationTokenPayload = {
	firstName: string,
	lastName: string,
	userId: string,
};

export type DecodedToken =
	| { expired: false, payload: AuthorizationTokenPayload }
	| { expired: true };

const PRIVATE_KEY = process.env.JWT_SECRET!;
const BEARER_STR = 'Bearer';

export const createAuthorizationToken = (payload: AuthorizationTokenPayload) => {
	/**
	 * For now, refresh tokens are not implemented. Ideally, this token should expires
	 * in an hour and be refreshed. For the sake of convenience, 12hrs seems long enough
	 * to interact with the website without frustration.
	 */
	return sign(payload, PRIVATE_KEY, {
		expiresIn: '12hr'
	});
};

export const getTokenFromAuthorizationHeader = (authorization: string) => {
	const [bearer, token] = authorization.split(' ');
	
	if (bearer !== BEARER_STR || !token) {
		throw new Error('Invalid authorization header format');
	}

	return token;
}

export const isPayloadFromAuthorization = (payload: any): payload is AuthorizationTokenPayload => {
	const nbKeys = Object.keys(payload).length;
	const areKeysCorrect = (
		typeof payload.firstName === 'string'
		&& typeof payload.lastName === 'string'
		&& typeof payload.userId === 'string'
	);

	return nbKeys === 3 && areKeysCorrect;
}

export const verifyAuthorizationToken = (token: string): DecodedToken => {
	try {
		const payload = verify(token, PRIVATE_KEY);

		if (!isPayloadFromAuthorization(payload)) {
			throw new Error('Invalid payload');
		}

		return {
			payload,
			expired: false,
		}
	} catch (err) {
		return { expired: true };
	}
}