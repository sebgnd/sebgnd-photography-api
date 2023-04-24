import { Types } from 'mongoose';

export type Entity = {
  id?: Types.ObjectId,
  createdAt?: Date,
  updatedAt?: Date,
};
