import Image from '../models/Image';
import Lense from '../models/Lense';
import Camera from '../models/Camera';
import Category from '../models/Category';
import { Op, Includeable } from 'sequelize';

export default class ImageService {
    public async get(id: number) {
        try {
            const image = await Image.findByPk(id, {
                include: [Category, Lense, Camera]
            });
            return image;
        } catch (e) {
            throw e;
        }
    }

    public async getFromGallery(categoryId: string) {
        try {
            const images = Image.findAll({
                attributes: ['id', 'width', 'height', 'uploadDate'],
                order: [['id', 'DESC']],
                include: [Category],
                where: { categoryId },
            });
            return images;
        } catch (e) {
            throw e;
        }
    }

    public async getAll() {
        try {
            return await this.getAllOrFromOffset();
        } catch (e) {
            throw e;
        }
    }

    public async getKFromOffset(k: number, offset: number) {
        try {
            return await this.getAllOrFromOffset(offset, k);
        } catch (e) {
            throw e;
        }
    }

    public async getAllOrFromOffset(offset?: number, limit?: number) {
        try {
            const images = await Image.findAll({
                attributes: ['id', 'width', 'height', 'uploadDate'],
                order: [['id', 'DESC']],
                include: [Category],
                offset,
                limit
            });
            return images; 
        } catch (e) {
            throw e;
        }
    }

    public async getWithAdjacent(image: Image, isSameCategory: boolean) {
        try {
            const previous = await this.getNextOrPrevious(image, 'previous', isSameCategory);
            const next = await this.getNextOrPrevious(image, 'next', isSameCategory);

            return {
                previous,
                image,
                next
            }
        } catch (error) {
            throw error;
        }
    }

    public async getNextOrPrevious(image: Image, side: 'next' | 'previous', isSameCategory: boolean = false) {
        const previous = side === 'previous';
        const categoryOptions: Includeable = {
            model: Category
        }

        if (isSameCategory) {
            categoryOptions.where = {
                id: image.category.id
            }
        }

        try {
            const adjacentImage = await Image.findOne({
                include: [categoryOptions, Lense, Camera],
                where: {
                    id: {
                        [previous ? Op.lt : Op.gt]: image.id
                    }
                },
                order: [['id', previous ? 'DESC' : 'ASC']]
            });
            return adjacentImage;
        } catch (e) {
            throw e;
        }
    }

    public async getCount(categoryId?: string) {
        const nbImages = Image.count({
            where: categoryId ? { categoryId } : undefined
        });
        return nbImages;
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