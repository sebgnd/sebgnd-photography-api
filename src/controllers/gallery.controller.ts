import { Request, Response, NextFunction } from 'express';
import GalleryService from '../services/gallery.service';

const galleryService = new GalleryService();

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const galleries = await galleryService.getAll();
        if (galleries.length != 0) {
            res.json(galleries);
        } else {
            next(new Error('Could not find any gallery'));
        }
    } catch (error) {
        next(error);
    }
}

const getWithLimit = async (req: Request, res: Response, next: NextFunction) => {
    const limit = parseInt(req.params.limit);
    try {
        const galleries = await galleryService.getWithLimit(limit);
        if (galleries.length != 0) {
            res.json(galleries);
        } else {
            next(new Error('Could not find any gallery'));
        }
    } catch (error) {
        next(error);
    }
}

export {
    getAll,
    getWithLimit
}