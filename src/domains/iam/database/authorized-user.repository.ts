import { AuthorizedUserModel } from '@database/entities/user';
import { User } from '@domains/iam/entities/user';

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
		sso: {
			providerUserId,
			provider,
		},
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
