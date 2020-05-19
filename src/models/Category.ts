import { Table, Column, Model, PrimaryKey, CreatedAt, HasMany, HasOne } from 'sequelize-typescript';
import Image from './Image';

@Table
export default class Category extends Model<Category> {
    
    @PrimaryKey
    @Column
    id!: string;

    @Column
    displayName!: string;

    @HasMany(() => Image)
    images!: Image[];

    @HasOne(() => Image)
    thumbnail!: Image;
}