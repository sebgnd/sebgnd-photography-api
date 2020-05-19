import { Table, Column, Model, PrimaryKey, CreatedAt, HasMany } from 'sequelize-typescript';
import Image from './Image';

@Table
export default class Lense extends Model<Lense> {
    @Column
    name!: string;

    @Column
    displayName!: string;

    @HasMany(() => Image)
    images!: Image[];
}