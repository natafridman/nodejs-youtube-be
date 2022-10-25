import express, { application, Request, Response } from "express"
import User from '../model/user.model'
import { createToken, userExists } from "../utils/database.utils"

export const signUp = async (req: Request, res:Response) => {
    if(await userExists(req.body.username)) return res.status(400).json({msg:'The user already exists'});

    try {
        const newUser = new User(req.body);
        await newUser.save(); 
        return res.status(201).json({msg:'The user was created'});
    } catch (e:any) {
        return res.status(500).json({msg:e.message});
    }
}

export const signIn = async (req: Request, res:Response) => {
    const user = await userExists(req.body.username);
    if(!user) return res.status(401).json({msg:'Invalid credentials'});

    if(!await user.comparePasswords(req.body.password)) return res.status(401).json({msg:'Invalid credentials'});

    const app = express();
    app.set('username', req.body.username);

    return res.status(200).json({msg:'OK', token: createToken(req.body)});
}
