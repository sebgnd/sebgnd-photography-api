import { Request, Response, NextFunction } from 'express';
import CategoryService from '../services/category.service';

const categoryService = new CategoryService();

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await categoryService.getAll();
        if (categories.length != 0) {
            res.json(categories);
        } else {
            next(new Error('Could not find any category'));
        }
    } catch (error) {
        next(error);
    }
}

export const getWithLimit = async (req: Request, res: Response, next: NextFunction) => {
    const limit = parseInt(req.params.limit);
    try {
        const categories = await categoryService.getWithLimit(limit);
        if (categories.length != 0) {
            res.json(categories);
        } else {
            next(new Error('Could not find any category'));
        }
    } catch (error) {
        next(error);
    }
}

export const getWithId = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
        const category = await categoryService.get(id);
        if (category) {
            res.json(category);
        } else {
            next(new Error('Could not find any category'));
        }
    } catch (error) {
        next(error);
    }
}