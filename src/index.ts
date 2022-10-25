import express from 'express';
import connectToDB from './utils/database.utils';
import config from '../config/default';
import log from './utils/logger.utils';
import routes from './routes/user.routes';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import blobRoutes from './routes/blob.routes';
import passport from 'passport';
import passportUserAuthenticate from './middlewares/user.validate';

const app = express();

// Middlewares
app.use(routes);
app.use(express.urlencoded({extended: false}));
app.use(express.json())
app.use(cors())
app.use(passport.initialize());
passport.use(passportUserAuthenticate);

// Routes
app.use(authRoutes);
app.use(blobRoutes)

app.get('/', (req, res) => { 
    res.send('API Running');
});

app.listen(config.port, async () => {
    log.info(`Server Running at port ${config.port}`);

    connectToDB();
});