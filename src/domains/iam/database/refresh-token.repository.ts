import { RefreshTokenModel, RefreshTokenOrmEntity } from '@database/entities/refresh-token';
import { RefreshToken } from '@domains/iam/entities/refresh-token';
import { transformOrNull } from '@libs/utils/function';

export const saveRefreshToken = async (refreshToken: RefreshToken): Promise<void> => {
  const ormRefreshToken = new RefreshTokenModel({
    userId: refreshToken.userId,
    token: refreshToken.value,
    ttl: refreshToken.ttl,
  });

  await ormRefreshToken.save();
};

export const getRefreshToken = async (token: string): Promise<RefreshToken | null> => {
  const refreshToken = await RefreshTokenModel.findOne({ token });

  return transformOrNull(
    refreshToken as RefreshTokenOrmEntity,
    (definedRefreshToken: RefreshTokenOrmEntity): RefreshToken => {
      return {
        value: definedRefreshToken.token,
        ttl: definedRefreshToken.ttl,
        userId: definedRefreshToken.userId.toString(),
        creationDate: new Date(definedRefreshToken.createdAt),
      };
    },
  );
};

export const deleteRefreshToken = async (token: string): Promise<void> => {
  await RefreshTokenModel.deleteOne({ token });
};
