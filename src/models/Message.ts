import { Table, Column, Model, CreatedAt, BelongsTo, DataType, ForeignKey, Default } from 'sequelize-typescript';
import User from './User';

@Table
export default class Message extends Model<Message> {
    
    @Column
    content!: string;

    @CreatedAt
    @Column({
        type: DataType.DATE
    })
    uploadDate!: Date;

    @Default(false)
    @Column
    seen!: boolean;

    @ForeignKey(() => User)
    @Column
    userId!: number;

    @BelongsTo(() => User)
    user!: User;
}