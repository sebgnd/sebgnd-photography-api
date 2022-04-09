import { CategoryModel, CategoryOrmEntity } from '../../../../database/entities/category';

import { categoryMapper } from './category.mapper';

export const findAllCategories = async () => {
	const categories = await CategoryModel.find();

	return categories.map((category) => {
		return categoryMapper.fromOrmEntity(category as CategoryOrmEntity);
	});
}

export const findCategory = async (id: string) => {
	const category = await CategoryModel
		.findById(id)
		.populate('images');

	return categoryMapper.fromOrmEntity(category as CategoryOrmEntity);
}
