import { Table, Column, Model, HasMany, Default, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import Image from './Image';

@Table
export default class Camera extends Model<Camera> {
    
    @Column
    name!: string;

    @Default(DataType.NOW)
    @CreatedAt
    @Column
    createdAt!: Date;

    @Default(DataType.NOW)
    @UpdatedAt
    @Column
    updatedAt!: Date;

    @HasMany(() => Image)
    images!: Image[];
}