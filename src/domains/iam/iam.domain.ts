import { createDomain } from '@libs/famework/domain';

import { loginController } from './controller/login.controller';
import { tokenController } from './controller/token.controller';

export const iamDomain = createDomain({
	name: 'iam',
	controllers: [
		loginController,
		tokenController,
	],
});
