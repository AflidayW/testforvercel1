import { body } from 'express-validator';
import { db } from "../db";
export const postsValidation = [

    body("title")
        .trim()
        .notEmpty().withMessage("Title is required")
        .isLength({ max: 30 }).withMessage("Name must be less than 15 characters"),
    body("shortDescription")
        .notEmpty().withMessage("Description is required")
        .isLength({ max: 100 }).withMessage("Description must be less than 100 characters"),
    body("content")
        .trim()
        .notEmpty().withMessage("Content is required")
        .isLength({ max: 1000 }).withMessage("Content must be less than 1000 characters"),

    body('blogId')
        .notEmpty().withMessage("Content is required")
        .custom(id => async () => {
            const blog = await db.collection("Blogs").findOne({ id: id });

            if (!blog) throw new Error("Blog not found")
            return true
        })
];