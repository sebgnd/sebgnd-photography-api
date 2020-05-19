import { Request, Response, NextFunction } from 'express';
import ImageService from '../services/image.service';

const imageService = new ImageService();

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const images = await imageService.getAll();
        if (images) {
            res.json(images);
        } else {
            next(new Error('Could not find any image'));
        }
    } catch (error) {
        next(error);
    }
}

export const getFromGallery = async (req: Request, res: Response, next: NextFunction) => {
    const gallery = req.params.id;
    try {
        const images = await imageService.getFromGallery(gallery);
        if (images) {
            res.json(images);
        } else {
            next(new Error('Could not find any image'));
        }
    } catch (error) {
        next(error);
    }
}

export const getKImagesFromOffset = async (req: Request, res: Response, next: NextFunction) => {
    const offset = parseInt(req.params.offset);
    const limit = parseInt(req.params.limit);
    try {
        const images = await imageService.getImagesFromOffset(offset, limit); 
        if (images) {
            res.json(images);
        } else {
            next(new Error('Could not find any image'));
        }
    } catch (error) {
        next(error);
    }
}

export const deleteImage = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
        if (imageService.delete(id)) {
            res.status(200).end();
        } else {
            next(new Error('Please change the thumbnail before deleting this images.'));
        }
    } catch (error) {
        next(error);
    }
}

export const getImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const image = await imageService.get(id);

        if (image) {
            res.json(image);
        } else {
            next(new Error('Cannot find this image'));
        }
    } catch (error) {
        next(error);
    }
}