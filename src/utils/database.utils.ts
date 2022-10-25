import mongoose, { ConnectOptions } from 'mongoose';
import config from '../../config/default';
import User, { IUser } from '../model/user.model'
import jwt from 'jsonwebtoken'

export default function connectToDb() {
    const dbUri = config.dbUri;

    const dbOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions;

    try {
        mongoose.connection.on('connecting', () => console.info('database connecting'));
        mongoose.connection.on('connected', () => console.info('database connected'));
        mongoose.connection.on('disconnecting', () => console.info('database disconnecting'));
        mongoose.connection.on('disconnected', () => console.info('database disconnected'));
        mongoose.connection.on('error', (e:any) => console.error(e));
        
        mongoose.connect(dbUri, dbOptions);
    } catch (e:any) {
        console.error(e.message);
        process.exit(1);
    }
}

export async function userExists(username: string) {
    return await User.findOne({username:username});
}

export function createToken(user: IUser) {
    return jwt.sign({id: user._id, username: user.username}, config.jwtSecret, {
        expiresIn: 86400
    });
}