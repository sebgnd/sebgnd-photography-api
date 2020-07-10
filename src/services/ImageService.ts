import Image from '../models/Image';
import Lense from '../models/Lense';
import Camera from '../models/Camera';
import Category from '../models/Category';
import { Op, Includeable } from 'sequelize';

export default class ImageService {
    public async getAll() {
        try {
            return await this.getAllOrFromOffset();
        } catch (e) {
            throw e;
        }
    }

    public async getNFromOffset(n: number, offset: number) {
        try {
            return await this.getAllOrFromOffset(offset, n);
        } catch (e) {
            throw e;
        }
    }

    public async getAllOrFromOffset(offset?: number, limit?: number) {
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
            const image =  await Image.findByPk(id, {
                include: [Category, Lense, Camera]
            });
            return image;
        } catch (e) {
            throw e;
        }
    }

    public async getAdjacent(image: Image, previous: boolean, sameCategory: boolean = false) {
        const categoryOptions: Includeable = {
            model: Category
        }

        if (sameCategory) {
            categoryOptions.where = {
                id: image.categoryId
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

    public async getFromGallery(categoryId: string) {
        try {
            const images = Image.findAll({
                order: [['id', 'ASC']],
                include: [Category, Lense, Camera],
                where: { categoryId },
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