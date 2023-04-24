import { Response } from 'express';
import { RefreshToken } from '@domains/iam/entities/refresh-token.entity';
import { addTimeToDate } from '@libs/utils/date';

export type TokenToSend = {
  authorizationToken: string,
  refreshToken: RefreshToken,
};

export const SECURE_REFRESH_TOKEN_COOKIE = '__Secure-RefreshToken';
export const REGULAR_REFRESH_TOKEN_COOKIE = 'RefreshToken';

export const getCookieName = () => {
  return process.env.NODE_ENV === 'dev'
    ? REGULAR_REFRESH_TOKEN_COOKIE
    : SECURE_REFRESH_TOKEN_COOKIE;
};

export const safelySendToken = (res: Response, tokens: TokenToSend) => {
  const { authorizationToken, refreshToken } = tokens;

  res.cookie(getCookieName(), refreshToken.token, {
    expires: addTimeToDate(new Date(), {
      seconds: refreshToken.ttl,
    }),
    secure: process.env.NODE_ENV === 'prod',
    sameSite: process.env.NODE_ENV === 'prod' ? 'none' : undefined,
    httpOnly: true,
  });
  res.status(200).json({
    token: authorizationToken,
  });
};
