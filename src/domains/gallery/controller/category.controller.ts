import { createController } from '../../../libs/famework/controller';
import { findAllCategories, findCategory } from '../database/category/category.repository';

export const categoryController = createController('categories', ({ builder }) => {
	builder
		.get('/', {
      handler: async (req, res) => {
        const categories = await findAllCategories();

        res.status(200).json({
          items: categories.map((category) => {
            return {
              id: category.id,
              createdAt: category.createdAt,
              updatedAt: category.updatedAt,
              displayName: category.formattedName,
              name: category.name,
              thumbnail: {
                id: category.thumbnail ? category.thumbnail.id : null,
              },
            };
          })
        });
      },
    })
    .get('/:id/images', {
      handler: async (req, res) => {
        const { id } = req.params;
        const category = await findCategory(id);

        res.status(200).json({
          items: category.images?.map((img) => {
            return {
              id: img.id,
              type: img.type,
              categoryId: img.categoryId,
              createdAt: img.createdAt,
              updatedAt: img.updatedAt,
            };
          }) || [],
        });
      }
    })
});
