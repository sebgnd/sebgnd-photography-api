import mongoose from 'mongoose';

const database = 'sebgnd_photography';
const host = `mongodb://127.0.0.1:27017/${database}`;

export const initDatabase = () => {
  return mongoose.connect(host, {
    bufferCommands: true,
    autoCreate: true,
    autoIndex: true,
  })
}
