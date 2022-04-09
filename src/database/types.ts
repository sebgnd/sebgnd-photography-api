import { Document, Types } from 'mongoose';

export type OrmEntity<Entity> = Document<any, any, Entity> & Entity & {
  _id: Types.ObjectId;
  createdAt: string,
  updatedAt: string,
};
