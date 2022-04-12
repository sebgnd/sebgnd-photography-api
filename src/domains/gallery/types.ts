import { PersistedEntity } from '../../libs/types' 

export type Image = PersistedEntity & {
  exif?: Exif;
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

export type Exif = {
  iso: number;
  shutterSpeed: number;
  aperture: number;
  focalLength: number;
}