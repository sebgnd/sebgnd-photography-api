import { Table, Column, Model, PrimaryKey, CreatedAt, HasMany, AllowNull } from 'sequelize-typescript';
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
}