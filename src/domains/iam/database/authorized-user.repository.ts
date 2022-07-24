import { AuthorizedUserModel, AuthorizedUserOrmEntity } from '@database/entities/user';
import { User } from '@domains/iam/entities/user';
import { transformOrNull } from '@libs/utils/function';

export const findUserById = async (id: string): Promise<User | null> => {
	const rawUser = await AuthorizedUserModel.findById(id);

	return transformOrNull(
		rawUser as AuthorizedUserOrmEntity,
		(user: AuthorizedUserOrmEntity): User => {
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

export const getAuthorizedUserWithProvider = async (providerUserId: string, provider: string): Promise<User | null> => {
	const rawUser = await AuthorizedUserModel.findOne({
		'sso.provider': 'google',
		'sso.providerUserId': providerUserId,
	});

	if (!rawUser) {
		return null;
	}

	return {
		id: rawUser._id,
		sso: {
			id: providerUserId,
			provider,
		},
	};
}
