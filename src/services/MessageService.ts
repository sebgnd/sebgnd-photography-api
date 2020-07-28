import Message from '../models/Message';
import User from '../models/User';
import UserService from './UserService';

export default class MessageService {
    public async createMessage(message: string, userName: string) {
        const userService = new UserService();

        try {
            let user = await userService.findByName(userName);

            if (user === null) {
                user = await userService.createUser(userName);
            }

            const newMessage = new Message({ content: message, userId: user.id });
            const createdMessage = newMessage.save();

            return createdMessage;
        } catch (err) {
            throw err;
        }
    }
}