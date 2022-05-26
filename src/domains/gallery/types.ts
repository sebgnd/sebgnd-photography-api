import { PersistedEntity } from '@libs/types' 

export type Exif = {
  iso: number;
  shutterSpeed: number;
  aperture: number;
  focalLength: number;
}

export type Image = PersistedEntity & {
  exif: Exif | null;
  type?: 'portrait' | 'landscape',
  categoryId: string,
	status?: 'processing' | 'valid' | 'error',
	temporaryFile?: {
		name: string,
		path: string,
	},
}

export type Category = PersistedEntity & {
	name: string;
	formattedName: string;
	thumbnail?: Thumbnail,
	images?: Image[],
}

export type Thumbnail = {
	id: string,
}