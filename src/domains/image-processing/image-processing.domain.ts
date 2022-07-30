import { createDomain } from '@libs/famework/domain';

import { imageFileController } from './controller/image-file.controller';
import { handleImageUploaded } from './event-handler/image-uploaded.handler';
import { handleImageDeleted } from './event-handler/image-deleted.handler';

import { initFileSystem } from './image-processing.init';

export const imageProcessingDomain = createDomain({
  name: 'image-processing',
  controllers: [imageFileController],
  eventHandlers: {
    'images:uploaded': handleImageUploaded,
    'images:deleted': handleImageDeleted,
  },
  init: async () => {
    await initFileSystem();
  },
});
