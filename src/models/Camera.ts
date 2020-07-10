import { Table, Column, Model, HasMany, Default, DataType, CreatedAt } from 'sequelize-typescript';
import Image from './Image';

@Table
export default class Camera extends Model<Camera> {
    
    @Column
    name!: string;

    @HasMany(() => Image)
    images!: Image[];

    @Default(DataType.NOW)
    @CreatedAt
    @Column
    createdAt!: Date;

    @Default(DataType.NOW)
    @CreatedAt
    @Column
    updatedAt!: Date;
}