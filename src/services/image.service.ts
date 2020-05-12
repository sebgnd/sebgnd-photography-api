import Image from '../models/image.model';
import Lense from '../models/lense.model';
import Camera from '../models/camera.model';
import Gallery from '../models/gallery.model';
import ThumbnailGallery from '../models/thumbnail-gallery.model';

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
            // Get the image is used for a thumbnail
            const thumbnail = await ThumbnailGallery.findOne({
                where: {idImage: id}
            });
            if (!thumbnail) {
                // Response is the number of images that have been deleted
                // We only ask for one image to be deleted
                const response: number = await Image.destroy({
                    where: {id}
                });
                return response == 1;
            }
            return false;
        } catch (e) {
            throw e;
        }
    }
}