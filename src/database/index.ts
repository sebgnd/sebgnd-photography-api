import mongoose from 'mongoose';

const database = process.env.MONGO_DB_DATABASE_NAME;
const host = process.env.MONGO_DB_DATABASE_URI;

export const initDatabase = () => {
  if (!host || !database) {
    throw new Error('process.env is not setup: could not find the host or the database');
  }

  return mongoose.connect(host, {
    dbName: database,
    bufferCommands: true,
    autoCreate: true,
    autoIndex: true,
  });
};
