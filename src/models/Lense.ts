import { Table, Column, Model, Default, CreatedAt, HasMany, DataType, UpdatedAt } from 'sequelize-typescript';
import Image from './Image';

@Table
export default class Lense extends Model<Lense> {
    @Column
    name!: string;

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
}