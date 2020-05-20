import { Request, Response, NextFunction } from 'express';
import ImageService from '../services/ImageService';
import CategoryService from '../services/CategoryService';
import Image from '../models/Image';

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
        const id: number = parseInt(req.params.id);
        const withAdjacent: boolean = req.query.withAdjacent !== undefined ? req.query.withAdjacent : false;
        const sameCategory: boolean = req.query.sameCategory !== undefined ? req.query.sameCategory : false;
        const image = await imageService.get(id);

        if (withAdjacent && image) {
            console.log('Sending adjacents images');
            const response = await getAdjacentJson(image, sameCategory);
            res.json(response);
        } else {

            console.log('Sending image');
            res.json(image);
        }

    } catch (error) {
        next(error);
    }
}

const getAdjacentJson: any = async (image: Image, sameCategory: boolean) => {
    try {
        const previous = await imageService.getAdjacent(image, true, sameCategory);
        const next = await imageService.getAdjacent(image, false, sameCategory);

        const response = {
            previous,
            image,
            next
        }

        return response;

    } catch (e) {
        throw e;
    }
}