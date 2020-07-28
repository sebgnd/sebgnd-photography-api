import { Table, Column, Model, UpdatedAt, CreatedAt, AllowNull, BelongsTo, ForeignKey, DataType, Default } from 'sequelize-typescript';
import Category from './Category';
import Camera from './Camera';
import Lense from './Lense';

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

    @Column
    height!: number;

    @Column
    width!: number;

    @Default(DataType.NOW)
    @CreatedAt
    @Column
    uploadDate!: Date;

    @Default(DataType.NOW)
    @UpdatedAt
    @Column
    updatedAt!: Date;

    // Foreign Keys

    @ForeignKey(() => Category)
    categoryId!: number;

    @BelongsTo(() => Category)
    category!: Category;

    @ForeignKey(() => Camera)
    cameraId!: number;

    @BelongsTo(() => Camera)
    camera!: Camera;

    @ForeignKey(() => Lense)
    lenseId!: number;

    @BelongsTo(() => Lense)
    lense!: Lense;
}