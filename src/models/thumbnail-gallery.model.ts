import { Table, Column, Model, CreatedAt, BelongsTo, DataType, ForeignKey, Default, HasOne } from 'sequelize-typescript';
import Image from './image.model';
import Gallery from './gallery.model';

@Table
export default class ThumbnailGallery extends Model<ThumbnailGallery> {
    @ForeignKey(() => Image)
    @Column
    imageId!: number;

    @ForeignKey(() => Gallery)
    @Column
    galleryId!: string;

    @BelongsTo(() => Image)
    image!: Image;

    @BelongsTo(() => Gallery)
    gallery!: Gallery;
}