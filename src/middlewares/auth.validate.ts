import { Request, Response, NextFunction } from 'express'

export function validateAuth (req:Request, res:Response, next:NextFunction) {
    if (!req.body.username || !req.body.password) return res.status(400).json('Bad Request');

    next();
}