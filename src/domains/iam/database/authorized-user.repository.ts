import { AuthorizedUserModel, AuthorizedUserOrmEntity } from '@database/entities/user';
import { UserEntity } from '@domains/iam/entities/user.entity';
import { transformOrNull } from '@libs/utils/function';

export const findUserById = async (id: string): Promise<UserEntity | null> => {
  const rawUser = await AuthorizedUserModel.findById(id);

  return transformOrNull(
    rawUser as AuthorizedUserOrmEntity,
    (user: AuthorizedUserOrmEntity): UserEntity => {
      return {
        id: user._id,
        sso: {
          id: user.sso.providerUserId,
          provider: user.sso.provider,
        },
      };
    },
  );
};

export const doesUserExistWithProvider = (providerUserId: string, provider: string) => {
  return AuthorizedUserModel.exists({
    sso: {
      providerUserId,
      provider,
    },
  });
};

export const getAuthorizedUserWithProvider = async (providerUserId: string, provider: string): Promise<UserEntity | null> => {
  const rawUser = await AuthorizedUserModel.findOne({
    'sso.provider': 'google',
    'sso.providerUserId': providerUserId,
  });

  if (!rawUser) {
    return null;
  }

  return {
    id: rawUser._id.toString(),
    sso: {
      id: providerUserId,
      provider,
    },
  };
};
