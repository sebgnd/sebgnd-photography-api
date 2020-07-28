import User from '../models/User';

export default class UserService {
    public async findByName(name: string) {
        try {
            const user: User | null = await User.findOne({
                where: { name }
            })
            return user;
        } catch (err) {
            throw err;
        }
    }

    public async createUser(name: string, password?: string) {
        try {
             const user = new User({ name });
             const createdUser = user.save();
             return createdUser;
        } catch (err) {
            throw err;
        }
    }
}