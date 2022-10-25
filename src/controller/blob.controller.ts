import { BlobServiceClient, BlockBlobParallelUploadOptions } from "@azure/storage-blob";
import { NextFunction, Request, Response } from "express";
import config from '../../config/default'
import { v4 as uuidv4 } from 'uuid';
import { getBlobDuration } from '../utils/blob.utils2'

const blobService = BlobServiceClient.fromConnectionString(config.azureStorageConnString);

export const uploadBlob = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) return res.status(403).json({ msg: "Must attach a video file" });

        const newVideoGuid = uuidv4();
        const originalName = req.file?.originalname;
        const buffer = req.file?.buffer;

        const containerClient = blobService.getContainerClient(config.azureStorageVideoContainer);

        await containerClient.getBlockBlobClient(newVideoGuid).uploadData(buffer, {
            metadata: {
                title: originalName,
            }
        } as BlockBlobParallelUploadOptions);

        res.locals.blobId = newVideoGuid;
        res.locals.blobDuration = await getBlobDuration(buffer);
        res.locals.blobTitle = originalName;

        next();
    } catch (e: any) {
        return res.status(500).json({ msg: e.message });
    }
}

export const getBlob = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) return res.status(401).json({ msg: "Must indicate the video id" });

        const videoGuid = req.params.id as string;
        const videoPath = "public/" + videoGuid + ".mp4";

        const containerClient = blobService.getContainerClient(config.azureStorageVideoContainer);

        res.header("Content-Type", "video/mp4");
        const blockBlobClient = await containerClient.getBlockBlobClient(videoGuid)
        const blobMetadata = (await blockBlobClient.getProperties()).metadata;
        const response = await blockBlobClient.downloadToFile(videoPath)

        res.header("Title", blobMetadata?.title);

        const fs = require('fs');
        const videoStat = fs.statSync(videoPath);
        const fileSize = videoStat.size;
        const videoRange = req.headers.range;
        if (videoRange) {
            const parts = videoRange.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1]
                ? parseInt(parts[1], 10)
                : fileSize - 1;
            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(videoPath, { start, end });
            const header = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
                'Title': blobMetadata?.title
            };
            res.writeHead(206, header);
            file.pipe(res, { end: false }).on('close', function () {
                // try {
                //     fs.unlinkSync(videoPath)
                //     console.log(videoPath + " removed")
                // } catch (err) {
                //     console.log(videoPath + " not removed")
                //     console.error(err)
                // }
            })
        }
    } catch (e: any) {
        res.header("Content-Type", "application/json");
        return res.status(500).json({ msg: 'Video was not found ' + e.message });
    }
}

export const deleteBlob = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.id) return res.status(401).json({ msg: "Must indicate the video id" });

        const container = 'videos';
        const fileName = req.params.id;

        const containerClient = blobService.getContainerClient(container);

        const response = await containerClient.getBlockBlobClient(fileName).deleteIfExists();

        if (response.succeeded) {
            res.locals.blobId = req.params.id;
            next();
        }
        else
            return res.status(404).json({ msg: 'Video was not found' });
    } catch (e: any) {
        return res.status(500).json({ msg: e.message });
    }
}

function unlink(path: any) {
    throw new Error("Function not implemented.");
}

