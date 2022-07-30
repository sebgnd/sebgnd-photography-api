import { createDomain } from '@libs/famework/domain';

import { imageController } from './controller/image.controller';
import { categoryController } from './controller/category.controller';

export const galleryDomain = createDomain({
  name: 'gallery',
  controllers: [imageController, categoryController],
});
