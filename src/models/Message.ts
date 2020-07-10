import { Table, Column, Model, CreatedAt, BelongsTo, DataType, ForeignKey, Default, UpdatedAt } from 'sequelize-typescript';
import { Sequelize } from 'sequelize'
import User from './User'; 

@Table
export default class Message extends Model<Message> {
    
    @Column
    content!: string;

    @Default(false)
    @Column
    seen!: boolean;

    @ForeignKey(() => User)
    @Column
    userId!: number;

    @Default(DataType.NOW)
    @CreatedAt
    @Column
    createdAt!: Date;

    @Default(DataType.NOW)
    @CreatedAt
    @Column
    updatedAt!: Date;

    @BelongsTo(() => User)
    user!: User;
}