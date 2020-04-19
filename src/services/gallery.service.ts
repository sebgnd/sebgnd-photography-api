import Image from '../models/image.model';
import Lense from '../models/lense.model';
import Camera from '../models/camera.model';
import Gallery from '../models/gallery.model';
import ThumbnailGallery from '../models/thumbnail-gallery.model';

export default class GalleryService {

    public async getAll() {
        try {
            const galleries = await Gallery.findAll({
                order: [['id', 'ASC']]
            });
            return galleries;
        } catch (e) {
            throw e;
        }
    }

    public async getWithLimit(limit: number) {
        try {
            const galleries = await Gallery.findAll({
                order: [['id', 'ASC']],
                limit
            });
            return galleries;
        } catch (e) {
            throw e;
        }
    }

    public async get(id: number) {
        try {
            return await Gallery.findByPk(id, {
                include: [Image]
            });
        } catch (e) {
            throw e;
        }
    }
}