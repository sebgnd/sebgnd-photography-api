import { Table, Column, Model, Default, CreatedAt, HasMany, AllowNull, DataType, UpdatedAt } from 'sequelize-typescript';
import Message from './Message';

@Table
export default class User extends Model<User> {
    
    @Column
    name!: string;

    @AllowNull
    @Column
    password?: string;

    @Default(DataType.NOW)
    @CreatedAt
    @Column
    createdAt!: Date;

    @Default(DataType.NOW)
    @CreatedAt
    @Column
    updatedAt!: Date;

    @HasMany(() => Message)
    messages!: Message[];
}