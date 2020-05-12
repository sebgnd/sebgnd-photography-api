import { Request, Response, NextFunction } from 'express';
import GalleryService from '../services/gallery.service';

const galleryService = new GalleryService();

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
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

export const getWithLimit = async (req: Request, res: Response, next: NextFunction) => {
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

export const getWithId = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
        const gallery = await galleryService.get(id);
        if (gallery) {
            res.json(gallery);
        } else {
            next(new Error('Could not find any gallery'));
        }
    } catch (error) {
        next(error);
    }
}