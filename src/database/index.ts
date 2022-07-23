import mongoose from 'mongoose';

const database = 'sebgnd_photography';
const host = process.env.NODE_ENV === 'dev'
	? process.env.MONGO_DB_DATABASE_LOCAL
	: process.env.MONGO_DB_DATABASE_PROD;

export const initDatabase = () => {
	if (!host) {
		throw new Error('process.env is not setup: could not find the host')
	}

  return mongoose.connect(host, {
		dbName: database,
    bufferCommands: true,
    autoCreate: true,
    autoIndex: true,
  })
}
