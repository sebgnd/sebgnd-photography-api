import { PersistedEntity } from '@libs/types'

import { Image } from './image.entity';

export type Category = PersistedEntity & {
	name: string;
	formattedName: string;
	thumbnail?: Thumbnail,
	images?: Image[],
}

export type Thumbnail = {
	id: string,
}

export const doesImageBelongToCategory = (category: Category, image: Image) => {
	return image.categoryId === category.id;
}

export const isImageThumbnail = (category: Category, imageId: string) => {
	return category.thumbnail?.id === imageId;
}
