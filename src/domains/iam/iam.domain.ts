import { createDomain } from '@libs/famework/domain';

import { accessController } from './controller/access.controller';
import { tokenController } from './controller/token.controller';

export const iamDomain = createDomain({
  name: 'iam',
  controllers: [
    accessController,
    tokenController,
  ],
});
