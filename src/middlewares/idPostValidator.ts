import { Request, Response, NextFunction } from 'express';
import { db } from "../db";
export const idPostValidator = (req: Request, res: Response, next: NextFunction) => {
    const id = db.posts.find(object => object.id === +req.params.id)

    if (!id) {
        return res.status(404).json({ message: 'Post not found' });


    }
    next()
}