import express, { application, NextFunction, Request, Response } from "express";
import config from '../../config/default'
import Video from "../model/video.model";
import User from "../model/user.model";
import dayjs from 'dayjs'
import { getUsername } from "../middlewares/user.validate";

const app = express();
const username = app.get('username');

export const saveVideo = async (req:Request, res:Response) => {
    try {
        const { blobId, blobDuration, blobTitle } = res.locals;

        const newVideo = new Video({
            id: blobId,
            duration: blobDuration,
            title: blobTitle,
            createdAt: dayjs().format() as unknown as Date,
            owner: getUsername(req)
        });

        await newVideo.save().then(video => {
            return User.findOneAndUpdate({id:username}, {
                $push: { videos: video._id }
            }, { new: true });
        });

        return res.status(201).json({msg:'The video was uploaded', id: blobId});
    } catch (e:any) {
        return res.status(500).json({msg:e.message});
    }
};

export const deleteVideo = async (req:Request, res:Response) => {
    try {
        const { blobId } = res.locals;

        // Try to delete the video and if not throw an error
        const videoDeleted = await Video.findOneAndDelete({id: blobId}, { new: true }).then(r => {
            return User.findOneAndUpdate({id:username}, {
                $pull: { videos: r?._id }
            }, { new: true });
        })

        console.log(videoDeleted)

        return res.status(201).json({msg:'The video was deleted'});
    } catch (e:any) {
        return res.status(500).json({msg:e.message});
    }
};

export const getVideos = async (req:Request, res:Response) => {
    try {
       const allVideos = await Video.find();
       
        return res.status(200).json(allVideos);
    } catch (e:any) {
        return res.status(500).json({msg:e.message});
    }
};

export const getUserVideos = async (req: Request, res:Response) => {
    try {
        const allVideos = await Video.find({owner: getUsername(req)});
        
         return res.status(200).json(allVideos);
     } catch (e:any) {
         return res.status(500).json({msg:e.message});
     }
}

export const getVideo = async (req: Request, res:Response) => {
    try {
        const { id } = req.params
        
        const video = await Video.find({id});
        
         return res.status(200).json(video[0]);
     } catch (e:any) {
         return res.status(500).json({msg:e.message});
     }
}
