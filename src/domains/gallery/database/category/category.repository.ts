import { CategoryModel, CategoryOrmEntity } from '@database/entities/category';

import { categoryMapper } from './category.mapper';

export const findAllCategories = async () => {
	const categories = await CategoryModel
		.find()
		.select('-images');

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

export const doesCategoryWithNameExist = async (name: string) => {
	const category = await CategoryModel.findOne({ name });

	return category !== null;
}

export const addImagesToCategory = async(categoryId: string, imageIds: string[]) => {
	const updatedCategory = await CategoryModel.findByIdAndUpdate(categoryId, {
		$push: {
			images: imageIds,
		}
	});

	return true;
}
