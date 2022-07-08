import { createController } from '@libs/famework/controller';
import { buildErrorResponse } from '@libs/famework/response';

import { deleteRefreshToken, getRefreshToken, saveRefreshToken } from '@domains/iam/database/refresh-token.repository';

import { validateIdToken } from '@domains/iam/service/google-sso';
import { getAuthorizedUserWithProvider } from '@domains/iam/database/authorized-user.repository';
import { createAuthorizationToken } from '@domains/iam/entities/authorization-token';
import { generateRefreshTokenForUser } from '@domains/iam/entities/refresh-token'
import { getCookieName, safelySendToken } from '@domains/iam/transport/token-response';

import { authorization } from '@domains/iam/middleware/authorization.middleware';

export const accessController = createController('iam', ({ builder }) => {
	builder.
		post('login/google', {
			handler: async (req, res) => {
				const { idToken } = req.body;

				if (!idToken) {
					res.status(400).json(
						buildErrorResponse('You must provide the google id token', {
							idToken: 'Must be a valid idToken from Google',
						}),
					);

					return;
				}

				const googleIdentity = await validateIdToken(idToken);
				const user = await getAuthorizedUserWithProvider(googleIdentity.id, 'google');

				if (user === null) {
					res.status(401).json(
						buildErrorResponse('Unauthorized user'),
					);

					return;
				}

				const [refreshToken, authorizationToken] = await Promise.all([
					generateRefreshTokenForUser(user.id.toString()),
					createAuthorizationToken(user.id.toString()),
				]);

				await saveRefreshToken(refreshToken);

				safelySendToken(res, {
					authorizationToken,
					refreshToken,
				});
			},
		})
		.post('logout', {
			middlewares: [
				authorization(),
			],
			handler: async (req, res) => {
				const cookieToken = req.cookies[getCookieName()];
				const refreshToken = cookieToken
					? await getRefreshToken(cookieToken)
					: null;

				if (!refreshToken) {
					res.status(403).json(
						buildErrorResponse('Could not find the refresh token'),
					);
	
					return;
				}

				await deleteRefreshToken(refreshToken.value);

				res.clearCookie(getCookieName());
				res.status(204);
			},
		})
});