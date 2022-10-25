import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/api/user/videos', passport.authenticate('jwt', { session: false }), (req:any, res:any) => { return res.status(200).json('jiji'); });

export default router;