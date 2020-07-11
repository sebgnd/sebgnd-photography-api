import { Request, Response, NextFunction } from 'express';
import path from 'path';
import ImageService from '../services/ImageService';

const imageService = new ImageService();

export const sendImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const types = ['medium_res', 'full_res', 'small_res', 'thumbnail_medium', 'thumbnail_small'];
        const type = req.params.type;
        const id = req.params.id;
        const image = await imageService.get(parseInt(id));

        if (image) {
            const categoryId = image.categoryId;
            let rightType = types[0];

            if (types.includes(type)) {
                rightType = type;
            }

            const imgPath = path.join(__dirname, '..', '..', 'categories', categoryId, rightType, `${id}.jpg`);
            res.sendFile(imgPath);
        } else {
            res.status(404);
        }

    } catch (error) {
        next(error);
    }
}