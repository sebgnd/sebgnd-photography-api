import express from 'express';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import routes from './routes';

import ErrorLogger from './utils/errors/logger';
import ErrorUtils from './utils/errors/ErrorUtils';

const app = express();
const logger = new ErrorLogger();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// Get all the routes
app.use('/', routes);

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    const statusCode = ErrorUtils.isHttpError(err)
        ? err.status
        : 500;

    res.status(statusCode).json({
        error: {
            message: err.message
        }
    });

    logger.add(err);
})

export default app;