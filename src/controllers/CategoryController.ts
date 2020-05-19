import { Request, Response, NextFunction } from 'express';
import CategoryService from '../services/CategoryService';
import ImageService from '../services/ImageService';
import Category from '../models/Category';
import Image from '../models/Image';

const categoryService = new CategoryService();
const imageService = new ImageService();

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const offset: number = parseInt(req.query.offset);
        const n: number = parseInt(req.query.n);
        let categories: Category[] = [];

        if (offset && n) {
            categories = await categoryService.getNFromOffset(n, offset);
        } else {
            categories = await categoryService.getAll();
        }

        res.json(categories);

    } catch (error) {
        next(error);
    }
}

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id: string = req.params.id;
        const category: Category | null = await categoryService.get(id);
        res.json(category);
    } catch (error) {
        next(error);
    }
}

export const getImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const images: Image[] = await imageService.getFromGallery(id);
        res.json(images);
    } catch(error) {
        next(error);
    }
}