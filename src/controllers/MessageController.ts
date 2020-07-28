import { Request, Response, NextFunction } from 'express';
import { validationResult  } from 'express-validator';
import MessageService from '../services/MessageService';
import HttpError from '../utils/errors/HttpError';

const messageService = new MessageService();

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        next(error);
    }
}

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try { 

    } catch (error) {
        next(error);
    }
}

export const postMessage = async (req: Request, res: Response, next: NextFunction) => {
    try { 
        const { body } = req;
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            res.status(400).json({
                error: {
                    message: 'Bad request',
                    errors: errors.array()
                }
            })
        } else {
            const { name, message } = body;
            const createdMessage = await messageService.createMessage(message, name);

            res.send(createdMessage);
        }
    } catch (error) {
        next(error);
    }
}