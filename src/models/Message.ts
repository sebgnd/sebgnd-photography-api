import { Table, Column, Model, CreatedAt, BelongsTo, DataType, ForeignKey, Default, UpdatedAt, Length } from 'sequelize-typescript';
import { Sequelize } from 'sequelize'
import User from './User'; 

@Table
export default class Message extends Model<Message> {
    @Length({ min: 1, max: 2000 })
    @Column
    content!: string;

    @Default(false)
    @Column
    seen!: boolean;

    @Default(DataType.NOW)
    @CreatedAt
    @Column
    createdAt!: Date;

    @Default(DataType.NOW)
    @UpdatedAt
    @Column
    updatedAt!: Date;

    // Foreign Keys

    @ForeignKey(() => User)
    userId!: number;

    @BelongsTo(() => User)
    user!: User;
}