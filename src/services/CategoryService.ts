import Image from '../models/Image';
import Lense from '../models/Lense';
import Camera from '../models/Camera';
import Category from '../models/Category';

export default class CategoryService {

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
                include: [{
                    model: Image,
                    where: {isThumbnail: true},
                    as: 'thumbnail'
                }],
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