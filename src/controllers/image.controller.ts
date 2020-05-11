import { Request, Response, NextFunction } from 'express';
import path from 'path';

export const sendImage = async (req: Request, res: Response, next: NextFunction) => {
    const gallery = req.params.gallery;
    const size = req.params.size;
    const image = req.params.id;
    const imgPath = path.join(__dirname, '..', '..', 'categories', gallery, size, `${image}.jpg`);

    try {
        console.log(`Sending file: ${imgPath}`);
        res.sendFile(imgPath);
    } catch (error) {
        next(error);
    }
}