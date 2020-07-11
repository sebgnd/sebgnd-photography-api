import { Request, Response, NextFunction } from 'express';
import ImageService from '../services/ImageService';
import CategoryService from '../services/CategoryService';
import Image from '../models/Image';

const imageService = new ImageService();
const categoryService = new CategoryService();

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const offset = parseInt(req.query.offset);
        const k = parseInt(req.query.k);
        let images;

        if (offset >= 0 && k >= 0) {
            images = await imageService.getKFromOffset(k, offset);
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
        const withAdjacent: boolean = req.query.withAdjacent ? req.query.withAdjacent === 'true' : false;
        const sameCategory: boolean = req.query.sameCategory ? req.query.sameCategory === 'true' : false;
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