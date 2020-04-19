import app from './application';
import sequelize from './sequelize';

const port = process.env.port || 8000;

// Setup sequelize and start the app on port 8000
sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    })
})