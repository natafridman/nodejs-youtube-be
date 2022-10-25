import mongoose, { Schema, Document, model } from 'mongoose'

export interface IVideo extends Document{
    title: string;
    id: string;
    duration: string;
    screenshot: string;
    createdAt: Date;
    owner: string;
}

const videoSchema = new Schema({
    id: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    duration: {
        type: String,
        required: true,
        trim: true
    },
    screenshot: {
        type: String,
        trim: true
    },
    owner: {
        type: String,
        trim: true,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        trim: true
    }
})

export default model<IVideo>('Video', videoSchema);