import { Table, Column, Model, PrimaryKey, CreatedAt, HasMany, HasOne } from 'sequelize-typescript';
import Image from './image.model';

@Table
export default class Gallery extends Model<Gallery> {
    
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