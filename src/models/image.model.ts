import { Table, Column, Model, PrimaryKey, CreatedAt, AllowNull, BelongsTo, ForeignKey, DataType } from 'sequelize-typescript';
import Gallery from './gallery.model';
import Camera from './camera.model';
import Lense from './lense.model';

@Table
export default class Image extends Model<Image> {
    @AllowNull
    @Column
    iso?: number;

    @AllowNull
    @Column
    shutterSpeed?: string;

    @AllowNull
    @Column
    aperture?: string;

    @AllowNull
    @Column
    focalLength?: string;

    @CreatedAt
    @Column({
        type: DataType.DATE
    })
    uploadDate!: Date;

    @ForeignKey(() => Gallery)
    @Column
    galleryId!: string;

    @ForeignKey(() => Camera)
    @Column
    cameraId!: number;

    @ForeignKey(() => Lense)
    @Column
    lenseId!: number;

    @BelongsTo(() => Gallery)
    gallery!: Gallery;

    @BelongsTo(() => Camera)
    camera!: Camera;

    @BelongsTo(() => Lense)
    lense!: Lense;
}