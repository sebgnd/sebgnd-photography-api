import { Table, Column, Model, PrimaryKey, CreatedAt, HasMany, HasOne, DataType } from 'sequelize-typescript';
import Image from './Image';
import CategoryThumbnail from './CategoryThumbnail';

@Table
export default class Category extends Model<Category> {
    
    @PrimaryKey
    @Column
    id!: string;

    @Column
    displayName!: string;
    
    @CreatedAt
    @Column
    createdAt!: Date;

    @CreatedAt
    @Column({
        type: DataType.DATE
    })
    updatedAt!: Date;

    @HasMany(() => Image)
    images!: Image[];

    @HasOne(() => CategoryThumbnail)
    thumbnail!: CategoryThumbnail;
}