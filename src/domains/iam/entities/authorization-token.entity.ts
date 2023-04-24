import { getSecondsEpoch } from '@libs/utils/date';
import { sign, verify } from 'jsonwebtoken';

export type AuthorizationTokenEntity = string;
export type AuthorizationTokenPayload = {
  iat: number,
  iss: string,
  sub: string,
};
export type DecodedAuthorizationToken =
  | { expired: false, payload: AuthorizationTokenPayload }
  | { expired: true };

const BEARER_STR = 'Bearer';
const TOKEN_ISSUER = 'api.sebgnd-photography.com/iam';

export const createAuthorizationToken = (userId: string): Promise<string> => {
  const iat = getSecondsEpoch(new Date());
  const iss = TOKEN_ISSUER;
  const sub = userId;

  return Promise.resolve(
    sign({ iat, iss, sub }, process.env.JWT_SECRET!, {
      expiresIn: '30min',
    }),
  );
};

export const getTokenFromAuthorizationHeader = (authorization: string) => {
  const [bearer, token] = authorization.split(' ');

  if (bearer !== BEARER_STR || !token) {
    throw new Error('Invalid authorization header format');
  }

  return token;
};

export const isPayloadFromAuthorization = (payload: any): payload is AuthorizationTokenPayload => {
  const nbKeys = Object.keys(payload).length;
  const areKeysCorrect = typeof payload.sub === 'string'
    && typeof payload.exp === 'number'
    && typeof payload.iss === 'string'
    && typeof payload.iat === 'number';

  return nbKeys === 4 && areKeysCorrect;
};

export const verifyAuthorizationToken = (token: string): DecodedAuthorizationToken => {
  try {
    const payload = verify(token, process.env.JWT_SECRET!);

    if (!isPayloadFromAuthorization(payload)) {
      throw new Error('Invalid payload');
    }

    return {
      payload,
      expired: false,
    };
  } catch (err) {
    return { expired: true };
  }
};

