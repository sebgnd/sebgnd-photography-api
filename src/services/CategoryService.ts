import Image from '../models/Image';
import Category from '../models/Category';
import CategoryThumbnail from '../models/CategoryThumbnail';
import { Includeable } from 'sequelize/types';

export default class CategoryService {

    private readonly thumbnailIncludeable: Includeable[] = [{
        model: CategoryThumbnail,
        attributes: ['createdAt', 'updatedAt'],
        include: [{
            model: Image,
            attributes: ['id', 'uploadDate', 'height', 'width']
        }]
    }];

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

    private async getAllOrFromOffset(offset?: number, limit?: number) {
        try {
            return await Category.findAll({
                include: this.thumbnailIncludeable,
                limit,
                offset
            });
        } catch (e) {
            throw e;
        }
    }

    public async get(id: string) {
        try {
            return await Category.findByPk(id, {
                include: this.thumbnailIncludeable,
            });
        } catch (e) {
            throw e;
        }
    }
}