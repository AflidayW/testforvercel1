import { Request, Response, NextFunction } from 'express';
import { db } from "../db";
export const idBlogValidation = (req: Request, res: Response, next: NextFunction) => {
    const id = db.blogs.find(object => object.id === req.params.id)

    if (!id) {
        return res.status(404).json({ message: 'Blog not found' });


    }
    next()
}