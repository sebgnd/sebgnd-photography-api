import mongoose from 'mongoose';

const database = 'sebgnd_photography';
const host = `mongodb://localhost:27017/${database}`;

export const initDatabase = () => {
  return mongoose.connect(host, {
    bufferCommands: true,
    autoCreate: true,
    autoIndex: true,
  })
}
