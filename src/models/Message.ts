import { Table, Column, Model, CreatedAt, BelongsTo, DataType, ForeignKey, Default, UpdatedAt } from 'sequelize-typescript';
import { Sequelize } from 'sequelize'
import User from './User'; 

@Table
export default class Message extends Model<Message> {
    
    @Column
    content!: string;

    @CreatedAt
    @Default(DataType.NOW)
    @Column({
        type: DataType.DATE
    })
    uploadDate!: Date;

    @UpdatedAt
    @Default(DataType.NOW)
    @Column({
        type: DataType.DATE
    })
    updatedAt!: Date;

    @Default(false)
    @Column
    seen!: boolean;

    @ForeignKey(() => User)
    @Column
    userId!: number;

    @BelongsTo(() => User)
    user!: User;
}