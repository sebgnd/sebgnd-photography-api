import { createController } from '@libs/famework/controller';
import { buildErrorResponse } from '@libs/famework/response';

import { validateIdToken } from '@domains/iam/service/google-sso';
import { getAuthorizedUserWithProvider } from '../database/authorized-user.repository';
import { createAuthorizationToken } from '../service/token';

export const loginController = createController('iam/login', ({ builder }) => {
	builder.post('/google', {
		handler: async (req, res) => {
			const { idToken } = req.body;

			if (!idToken) {
				res.status(400).json(
					buildErrorResponse('You must provide the google id token', {
						idToken: 'Must be a valid idToken from Google',
					}),
				);

				return;
			}

			const googleIdentity = await validateIdToken(idToken);
			const user = await getAuthorizedUserWithProvider(googleIdentity.id, 'google');

			if (user === null) {
				res.status(401).json(
					buildErrorResponse('Unauthorized user'),
				);

				return;
			}

			res.status(200).json({
				token: createAuthorizationToken({
					userId: user.id,
					firstName: googleIdentity.firstName,
					lastName: googleIdentity.lastName,
				}),
			});
		},
	});
});