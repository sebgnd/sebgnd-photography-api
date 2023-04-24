import { createController } from '@libs/famework/controller';
import { buildErrorResponse } from '@libs/famework/http/response';

import { getCookieName, safelySendToken } from '@domains/iam/transport/token-response';

import { deleteRefreshToken, getRefreshToken, saveRefreshToken } from '@domains/iam/database/refresh-token.repository';
import { generateRefreshTokenForUser, isRefreshTokenValid } from '@domains/iam/entities/refresh-token.entity';
import { findUserById } from '@domains/iam/database/authorized-user.repository';
import { createAuthorizationToken } from '@domains/iam/entities/authorization-token.entity';

export const tokenController = createController('iam/token', ({ builder }) => {
  builder.post('/refresh', {
    handler: async (req, res) => {
      const cookieToken = req.cookies[getCookieName()];
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
      const [newRefreshToken, newAuthorizationToken] = await Promise.all([
        generateRefreshTokenForUser(user!.id.toString()),
        createAuthorizationToken(user!.id.toString()),
      ]);

      await Promise.all([
        saveRefreshToken(newRefreshToken),
        deleteRefreshToken(refreshToken.value),
      ]);

      safelySendToken(res, {
        authorizationToken: newAuthorizationToken,
        refreshToken: newRefreshToken,
      });
    },
  });
});
