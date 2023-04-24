import { RefreshTokenOrmModel } from '@database/entities/refresh-token.orm';
import { RefreshToken } from '@domains/iam/entities/refresh-token.entity';

export type RefreshTokenRepository = {
  saveRefreshToken: (refreshToken: RefreshToken) => Promise<void>,
  getRefreshToken: (token: string) => Promise<RefreshToken | null>,
  deleteRefreshToken: (token: string) => Promise<void>,
};

export const refreshTokenRepository: RefreshTokenRepository = {
  saveRefreshToken: async (refreshToken) => {
    const ormRefreshToken = new RefreshTokenOrmModel(refreshToken);
    await ormRefreshToken.save();
  },

  getRefreshToken: async (token) => {
    const refreshToken = await RefreshTokenOrmModel.findOne({ token });
    if (!refreshToken) {
      return null;
    }

    return refreshToken.toJSON<RefreshToken>();
  },

  deleteRefreshToken: async (token) => {
    await RefreshTokenOrmModel.deleteOne({ token });
  },
};

