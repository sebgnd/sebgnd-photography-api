import { AuthorizedUserOrmModel } from '@database/entities/user.orm';
import { User } from '@domains/iam/entities/user.entity';

export type AuthorizedUserRepository = {
  findUserById: (id: string) => Promise<User | null>,
  doesUserExistWithProvider: (providerUserId: string, provider: string) => Promise<boolean>,
  getAuthorizedUserWithProvider: (providerUserId: string, provider: string) => Promise<User | null>,
};

export const authorizedUserRepositoryL: AuthorizedUserRepository = {
  findUserById: async (id: string) => {
    const user = await AuthorizedUserOrmModel.findById(id);
    if (!user) {
      return null;
    }

    return user.toJSON<User>();
  },

  doesUserExistWithProvider: async (providerUserId, provider) => {
    const exist = await AuthorizedUserOrmModel.exists({
      sso: {
        providerUserId,
        provider,
      },
    });

    return exist !== null;
  },

  getAuthorizedUserWithProvider: async (providerUserId, provider) => {
    const user = await AuthorizedUserOrmModel.findOne({
      'sso.provider': provider,
      'sso.providerUserId': providerUserId,
    });

    if (!user) {
      return null;
    }

    return user.toJSON<User>();
  },
};
