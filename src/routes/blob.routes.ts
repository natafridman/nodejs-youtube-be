import express from 'express';
import multer from 'multer';
import { deleteBlob, getBlob, uploadBlob } from '../controller/blob.controller';
import passport from 'passport';
import { deleteVideo, getUserVideos, getVideo, getVideos, saveVideo } from '../controller/video.controller';

const router = express.Router();
const upload = multer();

router.post('/api/blob/upload', passport.authenticate('jwt', { session: false }), upload.single('file'), uploadBlob, saveVideo);
router.get('/api/blob/get/:id', getBlob);
router.get('/api/blob/get', getVideos);
router.get('/api/blob/getVideo/:id', getVideo);
router.get('/api/blob/getUserVideos', getUserVideos);
router.delete('/api/blob/delete/:id', passport.authenticate('jwt', { session: false }), deleteBlob, deleteVideo);

export default router; 