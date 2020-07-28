import express from 'express';
import { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import ErrorLogger from './utils/errors/logger';

const app = express();
const logger = new ErrorLogger();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// Get all the routes
app.use('/', routes);

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.add(err);
    res.status(500).json({
        error: {
            message: err.message
        }
    })
})

export default app;