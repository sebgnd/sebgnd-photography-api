import { Request, Response, NextFunction } from 'express';
import ImageService from '../services/image.service';

const imageService = new ImageService();

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const images = await imageService.getAll();
        if (images.length != 0) {
            res.json(images);
        } else {
            next(new Error('Could not find any image'));
        }
    } catch (error) {
        next(error);
    }
}

const getFromGallery = async (req: Request, res: Response, next: NextFunction) => {
    const gallery = req.params.id;
    try {
        const images = await imageService.getFromGallery(gallery);
        if (images.length != 0) {
            res.json(images);
        } else {
            next(new Error('Could not find any image'));
        }
    } catch (error) {
        next(error);
    }
}

const deleteImage = async (req: Request, res: Response, next: NextFunction) => {
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

export { getAll, getFromGallery, deleteImage };