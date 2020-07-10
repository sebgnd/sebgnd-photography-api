import { Table, Column, Model, ForeignKey, Default, CreatedAt, DataType, BelongsTo } from 'sequelize-typescript';
import Image from './Image';
import Category from './Category';

@Table
export default class CategoryThumbnail extends Model<CategoryThumbnail> {
    @ForeignKey(() => Category)
    @Column
    categoryId!: string;

    @ForeignKey(() => Image)
    @Column
    imageId!: number;

    @BelongsTo(() => Category)
    category!: Category;

    @BelongsTo(() => Image)
    image!: Image;

    @Default(DataType.NOW)
    @CreatedAt
    @Column
    createdAt!: Date;

    @Default(DataType.NOW)
    @CreatedAt
    @Column
    updatedAt!: Date;
}