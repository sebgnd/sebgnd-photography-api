import { createController } from '@libs/famework/controller';
import { buildErrorResponse } from '@libs/famework/response';

import { REFRESH_TOKEN_COOKIE, safelySendToken } from '@domains/iam/transport/token-response';

import { deleteRefreshToken, getRefreshToken, saveRefreshToken } from '@domains/iam/database/refresh-token.repository';
import { generateRefreshTokenForUser, isRefreshTokenValid } from '@domains/iam/entities/refresh-token';
import { findUserById } from '@domains/iam/database/authorized-user.repository';
import { createAuthorizationToken } from '@domains/iam/entities/authorization-token';

export const tokenController = createController('iam/token', ({ builder }) => {
	builder.post('/refresh', {
		handler: async (req, res) => {
			const cookieToken = req.cookies[REFRESH_TOKEN_COOKIE];
			const refreshToken = cookieToken
				? await getRefreshToken(cookieToken)
				: null;

			if (!cookieToken || !refreshToken ) {
				res.status(403).json(
					buildErrorResponse('Could not find the refresh token'),
				);

				return;
			}

			const refreshTokenValid = isRefreshTokenValid(refreshToken, new Date());

			if (!refreshTokenValid) {
				res.status(403).json(
					buildErrorResponse('Invalid refresh token'),
				);

				return;
			}

			/**
			 * If users have refreshToken, they will always exist
			 */
			const user = await findUserById(refreshToken.userId);
			const newRefreshToken = generateRefreshTokenForUser(user!.id.toString());
			const newAuthorizationToken = createAuthorizationToken({
				userId: user!.id,
			});

			await Promise.all([
				saveRefreshToken(newRefreshToken),
				deleteRefreshToken(refreshToken.value),
			]);

			safelySendToken(res, {
				authorizationToken: newAuthorizationToken,
				refreshToken: newRefreshToken,
			});
		}
	});
});