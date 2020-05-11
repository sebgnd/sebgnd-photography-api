import Image from '../models/image.model';
import Lense from '../models/lense.model';
import Camera from '../models/camera.model';
import Gallery from '../models/gallery.model';
import ThumbnailGallery from '../models/thumbnail-gallery.model';

export default class GalleryService {

    public async getAll() {
        try {
            const galleriesToThumbnails = await ThumbnailGallery.findAll({
                include: [Image, Gallery]
            });
            const galleries = galleriesToThumbnails.map(galleryToThumbnail => {
                const current: any = galleryToThumbnail.get({ plain: true });
                return {
                    ...current.gallery,
                    thumbnail: {
                        ...current.image
                    }
                }
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