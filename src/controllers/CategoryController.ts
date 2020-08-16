import { Request, Response, NextFunction } from 'express';
import HttpError from '../utils/errors/HttpError';
import CategoryService from '../services/CategoryService';
import ImageService from '../services/ImageService';
import Category from '../models/Category';
import Image from '../models/Image';

const categoryService = new CategoryService();
const imageService = new ImageService();

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const offset: number = parseInt(req.query.offset);
        const k: number = parseInt(req.query.k);
        let categories: Category[] = [];

        if (offset >= 0 && k >= 0) {
            categories = await categoryService.getKFromOffset(k, offset);
        } else {
            categories = await categoryService.getAll();
        }

        res.status(200).json(categories);

    } catch (error) {
        next(error);
    }
}

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id: string = req.params.id;
        const category: Category | null = await categoryService.get(id);

        if (category) {
            res.status(200).json(category); 
        } else {
            throw new HttpError(404, 'Category not found.');
        }
    } catch (error) {
        next(error);
    }
}

export const getImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const images: Image[] = await imageService.getFromGallery(id);
        res.status(200).json(images);
    } catch(error) {
        next(error);
    }
}