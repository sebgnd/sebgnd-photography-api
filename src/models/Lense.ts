import { Table, Column, Model, Default, CreatedAt, HasMany, DataType, UpdatedAt } from 'sequelize-typescript';
import Image from './Image';

@Table
export default class Lense extends Model<Lense> {
    @Column
    name!: string;

    @Column
    displayName!: string;

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