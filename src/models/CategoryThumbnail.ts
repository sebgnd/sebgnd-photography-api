import { Table, Column, Model, ForeignKey, Default, CreatedAt, DataType, BelongsTo, UpdatedAt } from 'sequelize-typescript';
import Image from './Image';
import Category from './Category';

@Table
export default class CategoryThumbnail extends Model<CategoryThumbnail> {
    @Default(DataType.NOW)
    @CreatedAt
    @Column
    createdAt!: Date;

    @Default(DataType.NOW)
    @UpdatedAt
    @Column
    updatedAt!: Date;

    // Foreign Keys

    @ForeignKey(() => Category)
    categoryId!: string;

    @BelongsTo(() => Category)
    category!: Category;

    @ForeignKey(() => Image)
    imageId!: number;

    @BelongsTo(() => Image)
    image!: Image;
}