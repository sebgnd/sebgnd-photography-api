import { BusinessEntityMapperFn, Mapper, OrmEntityMapperFn } from '@database/utils/mapper/mapper';

import { CategoryModel, CategoryOrmEntity } from '@database/entities/category';
import { ImageOrmEntity } from '@database/entities/image';

import { Category } from '@domains/gallery/entities/category.entity';

import { imageMapper } from '@domains/gallery/database/image/image.mapper';

const fromOrmEntity: OrmEntityMapperFn<CategoryOrmEntity, Category> = (category: CategoryOrmEntity): Category => ({
  id: category._id.toString(),
  name: category.name,
  formattedName: category.formattedName,
  thumbnail: category.thumbnail
    ? { id: category.thumbnail.id.toString() }
    : undefined,
  images: category.images
    ? category.images.map((img) => {
      return imageMapper.fromOrmEntity(img as ImageOrmEntity);
    })
    : [],
  createdAt: new Date(category.createdAt),
  updatedAt: new Date(category.updatedAt),
});

const fromBusinessEntity: BusinessEntityMapperFn<Category, CategoryOrmEntity> = (category: Category) => {
  const ormCategory = new CategoryModel();

  ormCategory._id = category.id;
  ormCategory.name = category.name;
  ormCategory.formattedName = category.formattedName;
  ormCategory.thumbnail = category.thumbnail
    ? { id: category.thumbnail.id }
    : undefined;

  return ormCategory as CategoryOrmEntity;
};

export const categoryMapper: Mapper<CategoryOrmEntity, Category> = {
  fromOrmEntity,
  fromBusinessEntity,
};
