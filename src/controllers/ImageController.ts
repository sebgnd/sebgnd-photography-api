import { Request, Response, NextFunction } from 'express';
import ImageService from '../services/ImageService';
import CategoryService from '../services/CategoryService';

const imageService = new ImageService();
const categoryService = new CategoryService();

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const offset = req.query.offset;
        const n = req.query.n;
        let images;

        if (offset && n) {
            images = await imageService.getNFromOffset(n, offset);
        } else {
            images = await imageService.getAll();
        }

        res.json(images);
        
    } catch (error) {
        next(error);
    }
}

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const image = await imageService.get(id);
        res.json(image);
    } catch (error) {
        next(error);
    }
}