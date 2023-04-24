import { CategoryOrmModel } from '@database/entities/category.orm';
import { Category, CategoryWithImages } from '@domains/gallery/entities/category.entity';

export type CategoryRepository = {
  findAllCategories: () => Promise<Category[]>,
  findCategory: (id: string) => Promise<CategoryWithImages | null>,
  doesCategoryExist: (id: string) => Promise<boolean>,
  doesCategoryWithNameExist: (name: string) => Promise<boolean>,
  addImageToCategory: (categoryId: string, imageId: string) => Promise<void>,
  removeImageFromCategory: (categoryId: string, imageId: string) => Promise<void>,
  setThumbnail: (categoryId: string, imageId: string) => Promise<void>,
};

export const categoryRepository: CategoryRepository = {
  findAllCategories: async () => {
    const categories = await CategoryOrmModel.find().select('-images');
    return categories.map((c) => c.toJSON<Category>());
  },

  findCategory: async (id: string) => {
    const category = await CategoryOrmModel.findById(id).populate('images');
    if (!category) {
      return null;
    }

    return category.toJSON<CategoryWithImages>();
  },

  doesCategoryWithNameExist: async (name: string) => {
    const category = await CategoryOrmModel.findOne({ name });
    return category !== null;
  },

  doesCategoryExist: async (id: string) => {
    const exist = await CategoryOrmModel.exists({ _id: id });
    return exist !== null;
  },

  addImageToCategory: async (categoryId: string, imageId: string) => {
    await CategoryOrmModel.findByIdAndUpdate(categoryId, {
      $push: {
        images: imageId,
      },
    });
  },

  removeImageFromCategory: async (categoryId: string, imageId: string) => {
    await CategoryOrmModel.updateOne({ _id: categoryId }, {
      $pull: {
        images: imageId,
      },
    });
  },

  setThumbnail: async (categoryId: string, imageId: string) => {
    await CategoryOrmModel.updateOne({ _id: categoryId }, {
      $set: {
        thumbnail: {
          id: imageId,
        },
      },
    });
  },
};
