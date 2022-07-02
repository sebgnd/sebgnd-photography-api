import { sign, verify } from 'jsonwebtoken';

export type AuthorizationToken = string;
export type AuthorizationTokenPayload = {
	userId: string,
};
export type DecodedAuthorizationToken =
	| { expired: false, payload: AuthorizationTokenPayload }
	| { expired: true };

const PRIVATE_KEY = process.env.JWT_SECRET!;
const BEARER_STR = 'Bearer';

export const createAuthorizationToken = (payload: AuthorizationTokenPayload) => {
	return sign(payload, PRIVATE_KEY, {
		expiresIn: '1hr'
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
	const areKeysCorrect = typeof payload.userId === 'string';

	return nbKeys === 1 && areKeysCorrect;
}

export const verifyAuthorizationToken = (token: string): DecodedAuthorizationToken => {
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

