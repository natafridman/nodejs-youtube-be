import mongoose, { Schema, Document, model } from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUser extends Document{
    username: string;
    password: string;
    comparePasswords: (password:string) => Promise<boolean>;
}

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    videos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video'
        }
    ]
})

userSchema.pre<IUser>('save', async function (next) {
    const user = this;

    // if user did nor change password, continue
    if(!user.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hashSync(user.password, salt);

    user.password = hash;
    next();    
})

userSchema.methods.comparePasswords = function (password: string) {
    return bcrypt.compareSync(password, this.password);
}

export default model<IUser>('User', userSchema);