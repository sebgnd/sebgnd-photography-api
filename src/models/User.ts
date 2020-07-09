import { Table, Column, Model, Default, CreatedAt, HasMany, AllowNull, DataType, UpdatedAt } from 'sequelize-typescript';
import Message from './Message';

@Table
export default class User extends Model<User> {
    
    @Column
    name!: string;

    @AllowNull
    @Column
    password?: string;

    @HasMany(() => Message)
    messages!: Message[];

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
}