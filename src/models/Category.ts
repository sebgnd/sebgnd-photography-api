import { Table, Column, Model, PrimaryKey, CreatedAt, HasMany, HasOne, UpdatedAt, Default, DataType } from 'sequelize-typescript';
import Image from './Image';
import CategoryThumbnail from './CategoryThumbnail';

@Table
export default class Category extends Model<Category> {
    
    @PrimaryKey
    @Column
    id!: string;

    @Column
    displayName!: string;
    
    @Default(DataType.NOW)
    @CreatedAt
    @Column
    createdAt!: Date;

    @Default(DataType.NOW)
    @CreatedAt
    @Column
    updatedAt!: Date;

    @HasMany(() => Image)
    images!: Image[];

    @HasOne(() => CategoryThumbnail)
    thumbnail!: CategoryThumbnail;
}