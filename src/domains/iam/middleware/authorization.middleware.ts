import { buildErrorResponse } from '@libs/famework/http/response';
import { Middleware } from '@libs/famework/types';
import { getTokenFromAuthorizationHeader, verifyAuthorizationToken } from '@domains/iam/entities/authorization-token.entity';

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
};
