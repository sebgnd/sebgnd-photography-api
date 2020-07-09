import { Table, Column, Model, PrimaryKey, CreatedAt, HasMany, HasOne, UpdatedAt, Default, DataType } from 'sequelize-typescript';
import Image from './Image';

@Table
export default class Category extends Model<Category> {
    
    @PrimaryKey
    @Column
    id!: string;

    @Column
    displayName!: string;
    
    @CreatedAt
    @Default(DataType.NOW)
    @Column({
        type: DataType.DATE
    })
    createdAt!: Date;

    @UpdatedAt
    @Default(DataType.NOW)
    @Column({
        type: DataType.DATE
    })
    updatedAt!: Date;

    @HasMany(() => Image)
    images!: Image[];

    @HasOne(() => Image)
    thumbnail!: Image;
}