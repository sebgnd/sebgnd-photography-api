import Image from '../models/image.model';
import Lense from '../models/lense.model';
import Camera from '../models/camera.model';
import Category from '../models/category.model';

export default class ImageService {

    public async getAll() {
        try {
            const images = await Image.findAll({
                order: [['id', 'ASC']],
                include: [Category, Lense, Camera]
            });
            return images;  
        } catch (e) {
            throw e;
        }
    }

    public async getImagesFromOffset(offset: number, limit: number) {
        try {
            const images = await Image.findAll({
                order: [['id', 'ASC']],
                include: [Category, Lense, Camera],
                offset,
                limit
            });
            return images; 
        } catch (e) {
            throw e;
        }
    }

    public async get(id: number) {
        try {
            return await Image.findByPk(id, {
                include: [Category, Lense, Camera]
            });
        } catch (e) {
            throw e;
        }
    }

    public async getFromGallery(id: string) {
        try {
            const images = Category.findByPk(id, {
                include: [{
                    model: Image,
                    as: 'images',
                    order: [['id', 'ASC']]
                }]
            });
            return images;
        } catch (e) {
            throw e;
        }
    }

    public async delete(id: number) {
        try {
            const response: number = await Image.destroy({
                where: {id, isThumbnail: false}
            });
            return response == 1;
        } catch (e) {
            throw e;
        }
    }
}