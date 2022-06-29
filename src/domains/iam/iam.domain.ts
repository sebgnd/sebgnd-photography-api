import { createDomain } from '@libs/famework/domain';

import { loginController } from './controller/login.controller';

export const iamDomain = createDomain({
	name: 'iam',
	controllers: [loginController],
});
