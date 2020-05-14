import Image from '../models/image.model';
import Lense from '../models/lense.model';
import Camera from '../models/camera.model';
import Category from '../models/category.model';

export default class CategoryService {

    public async getAll() {
        try {
            return await this.getAllOrLimit();
        } catch (e) {
            throw e;
        }
    }

    public async getWithLimit(limit: number) {
        try {
            return await this.getAllOrLimit(limit);
        } catch (e) {
            throw e;
        }
    }

    private async getAllOrLimit(limit: number | undefined = undefined) {
        try {
            return await Category.findAll({
                include: [{
                    model: Image,
                    where: {isThumbnail: true},
                    as: 'thumbnail'
                }],
                limit
            });
        } catch (e) {
            throw e;
        }
    }

    public async get(id: string) {
        try {
            return await Category.findByPk(id, {
                include: [{
                    model: Image,
                    where: {isThumbnail: true},
                    as: 'thumbnail'
                }]
            });
        } catch (e) {
            throw e;
        }
    }
}