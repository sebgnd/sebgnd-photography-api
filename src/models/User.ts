import { Table, Column, Model, Default, CreatedAt, HasMany, AllowNull, DataType, UpdatedAt, Length } from 'sequelize-typescript';
import Message from './Message';

@Table
export default class User extends Model<User> {
    
    @Length({ min: 1, max: 25 })
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
    @UpdatedAt
    @Column
    updatedAt!: Date;

    @HasMany(() => Message)
    messages!: Message[];
}