import { Request, Response, NextFunction } from 'express';
import ImageService from '../services/ImageService';
import Image from '../models/Image';
import HttpError from '../utils/errors/HttpError';

const imageService = new ImageService();

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.query.page !== undefined) {
            const page: number = parseInt(req.query.page) - 1;
            const imagesPerPage: number = req.query.itemsPerPage 
                ? parseInt(req.query.itemsPerPage) 
                : 5;

            if (page < 0) {
                throw new HttpError(422, 'Page must be a positive integer');
            } else if (imagesPerPage <= 0) {
                throw new HttpError(422, 'Amout of image per page must be a positive integer');
            } else {
                const offset = imagesPerPage * page;
                const images = await imageService.getKFromOffset(imagesPerPage + 1, offset);
                const total = await imageService.getCount();
                const hasNext = images[imagesPerPage] !== undefined;

                if (hasNext) images.pop();

                const result = {
                    data: images,
                    page: page + 1,
                    total,
                    hasNext
                };

                res.status(200).json(result);
            }
        } else {
           const images = await imageService.getAll();

           res.status(200).json(images);
        }
    } catch (error) {
        next(error);
    }
}

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id: number = parseInt(req.params.id);
        const withAdjacent: boolean = req.query.withAdjacent ? req.query.withAdjacent === 'true' : false;
        const sameCategory: boolean = req.query.sameCategory ? req.query.sameCategory === 'true' : false;
        const image: Image | null = await imageService.get(id);

        if (withAdjacent && image) {
            const response = await imageService.getWithAdjacent(image, sameCategory);
            res.status(200).json(response);
        } else if (image) {
            res.status(200).json(image);
        } else {
            throw new HttpError(404, 'Image not found.');
        }

    } catch (error) {
        next(error);
    }
}