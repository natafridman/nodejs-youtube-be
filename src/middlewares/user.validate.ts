import { Request } from "express";
import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import config from '../../config/default';
import { userExists } from "../utils/database.utils";
import jwt from 'jsonwebtoken'

const opts : StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
};

const userStrategy = new Strategy(opts, (payload, done) => {
    try {
        const user = userExists(payload.username);
        if(!user) return done(null, false);

        return done(null, user);
    } catch (e:any) {
        console.log(e);
        return done(e, false);
    }
});

export const getUsername = (req:Request) : string => {
    try {
        type UserToken = {
            id: string,
            username: string,
            iat: string,
            exp: string
        }   

        const authorizationHeader = (req.headers["authorization"] as string)?.replace("Bearer ", "").trim();
    
        const decode = jwt.verify(authorizationHeader, config.jwtSecret) as unknown as UserToken;

        return decode.username
    } catch (error:any) {
        console.log(error.message)
        return '';
    }
}    

export default userStrategy;