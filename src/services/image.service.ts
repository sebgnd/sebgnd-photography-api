import Image from '../models/image.model';
import Lense from '../models/lense.model';
import Camera from '../models/camera.model';
import Gallery from '../models/gallery.model';

export default class ImageService {

    public async getAll() {
        try {
            const images = await Image.findAll({
                order: [['id', 'ASC']],
                include: [Gallery, Lense, Camera]
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
                include: [Gallery, Lense, Camera],
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
                include: [Gallery, Lense, Camera]
            });
        } catch (e) {
            throw e;
        }
    }

    public async getFromGallery(id: string) {
        try {
            const images = Image.findAll({
                order: [['id', 'ASC']],
                where: { galleryId: id }, 
                include: [Lense, Camera]
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