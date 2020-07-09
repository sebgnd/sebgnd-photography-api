import { Sequelize } from 'sequelize-typescript';

const sequelize = new Sequelize({
    dialect: 'mysql',
    database: 'photography',
    username: 'root',
    password: 'root',
    models: [__dirname + '/models']
});

export default sequelize;