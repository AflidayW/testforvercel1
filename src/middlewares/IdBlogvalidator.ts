import { Request, Response, NextFunction } from 'express';
import { db } from "../db";
export const idBlogValidation =async (req: Request, res: Response, next: NextFunction) => {

    const id = await db.collection("Posts").findOne({ id: req.params.id })

    if (!id) {
        return res.status(404).json({ message: 'Blog not found' });


    }
    next()
}