import express from 'express';
import { validateAuth } from '../middlewares/auth.validate'
import { signIn, signUp } from '../controller/user.controller';
import passport from 'passport';

const router = express.Router();

router.post('/api/signup', validateAuth, signUp);
router.post('/api/signin', signIn);

export default router;