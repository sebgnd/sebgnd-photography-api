import { imageController } from './controller/image.controller';
import { categoryController } from './controller/category.controller';
import { createDomain } from '../../libs/famework/domain';

export const galleryDomain = createDomain({
	name: 'gallery',
	controllers: [imageController, categoryController],
});
