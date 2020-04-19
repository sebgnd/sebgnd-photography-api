import { Table, Column, Model, PrimaryKey, CreatedAt, HasMany } from 'sequelize-typescript';
import Image from './image.model';

@Table
export default class Camera extends Model<Camera> {
    
    @Column
    name!: string;

    @HasMany(() => Image)
    images!: Image[];
}