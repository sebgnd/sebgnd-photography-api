import { createController } from '@libs/famework/controller';

import { authorization } from '@domains/iam/middleware/authorization.middleware';

import { findAllCategories, findCategory, setThumbnail } from '@domains/gallery/database/category/category.repository';
import { findImage } from '@domains/gallery/database/image/image.repository';

import { doesImageBelongToCategory } from '@domains/gallery/entities/category.entity';

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
          }),
        });
      },
    })
    .get('/:id/images', {
      handler: async (req, res) => {
        const { id } = req.params;
        const category = await findCategory(id);

        res.status(200).json({
          items: (category.images || [])
            .filter((img) => img.status === 'valid')
            .map((img) => {
              return {
                id: img.id,
                type: img.type,
                categoryId: img.categoryId,
                createdAt: img.createdAt,
                updatedAt: img.updatedAt,
              };
            }),
        });
      },
    })
    .put('/:id/thumbnail', {
      middlewares: [
        authorization(),
      ],
      handler: async (req, res) => {
        const { id } = req.params;
        const { imageId: receivedImageId } = req.body;

        if (!receivedImageId || typeof receivedImageId !== 'string') {
          res.status(400).json({
            error: {
              message: 'You must provide an imageId',
              details: {
                imageId: 'Must be a string and correspond to an existing image',
              },
            },
          });
        }

        const imageId = receivedImageId as string;

        const [category, image] = await Promise.all([
          findCategory(id),
          findImage(imageId),
        ]);

        if (!category) {
          res.status(404).json({
            error: {
              message: 'Category not found',
            },
          });

          return;
        }

        if (!image) {
          res.status(400).json({
            error: {
              message: 'The image does not exist',
            },
          });

          return;
        }

        if (!doesImageBelongToCategory(category, image)) {
          res.status(400).json({
            error: {
              message: 'The image does not have the right category to be the thumbnail',
            },
          });

          return;
        }

        await setThumbnail(id, imageId);

        res.status(200).json({
          id,
          thumbnail: {
            id: imageId,
          },
        });
      },
    });
});
