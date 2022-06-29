import { buildErrorResponse } from '@libs/famework/response';
import { Middleware } from '@libs/famework/types';
import { getTokenFromAuthorizationHeader, verifyAuthorizationToken } from '@domains/iam/service/token';

export const authorization = (): Middleware => (req, res, next) => {
	const authorizationHeader = req.headers['authorization'];

	if (!authorizationHeader) {
		res.status(401).json(
			buildErrorResponse('Unauthorized'),
		);

		return;
	}

	const authorizationToken = getTokenFromAuthorizationHeader(authorizationHeader);
	const { expired } = verifyAuthorizationToken(authorizationToken);

	if (expired) {
		res.status(401).json(
			buildErrorResponse('Unauthorized'),
		);

		return;
	}

	next();
}
