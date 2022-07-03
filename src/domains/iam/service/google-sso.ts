import { OAuth2Client } from 'google-auth-library';

export type GoogleIdentity = {
	id: string,
	firstName: string,
	lastName: string,
};

export const validateIdToken = async (idToken: string): Promise<GoogleIdentity> => {
	const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID!);
	const ticket = await client.verifyIdToken({
		audience: process.env.GOOGLE_CLIENT_ID!,
		idToken,
	});
	const payload = ticket.getPayload();

	if (!payload) {
		throw new Error('Could not get user identity using google token');
	}

	return {
		id: payload['sub'],
		firstName: payload['given_name']!,
		lastName: payload['family_name']!,
	}
}