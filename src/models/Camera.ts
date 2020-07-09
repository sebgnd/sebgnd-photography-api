import { Table, Column, Model, UpdatedAt, CreatedAt, HasMany, Default, DataType } from 'sequelize-typescript';
import Image from './Image';
import { Sequelize } from 'sequelize';

@Table
export default class Camera extends Model<Camera> {
    
    @Column
    name!: string;

    @HasMany(() => Image)
    images!: Image[];

    @CreatedAt
    @Default(DataType.NOW)
    @Column({
        type: DataType.DATE
    })
    createdAt!: Date

    @UpdatedAt
    @Default(DataType.NOW)
    @Column({
        type: DataType.DATE
    })
    updatedAt!: Date;
}