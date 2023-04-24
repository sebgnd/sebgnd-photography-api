import { Types } from 'mongoose';

import * as crypto from 'crypto';
import * as util from 'util';

import { Entity } from '@libs/entity';

import { addTimeToDate } from '@libs/utils/date';

const randomBytes = util.promisify(crypto.randomBytes);

export type RefreshToken = Entity & {
  token: string,
  ttl: number,
  userId: Types.ObjectId,
};

// Two weeks in seconds
export const REFRESH_TOKEN_EXPIRATION = 1.21e6;

export const generateRefreshTokenForUser = async (userId: string): Promise<RefreshToken> => {
  const bytes = await randomBytes(16);

  return {
    token: bytes.toString('hex'),
    ttl: REFRESH_TOKEN_EXPIRATION,
    userId: new Types.ObjectId(userId),
  };
};

export const isRefreshTokenValid = (refreshToken: RefreshToken, date: Date) => {
  if (!refreshToken.createdAt) {
    return false;
  }

  const expirationDate = addTimeToDate(refreshToken.createdAt, {
    seconds: refreshToken.ttl,
  });

  return expirationDate.getTime() > date.getTime();
};
