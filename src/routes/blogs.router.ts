import { Router, Request, Response } from "express";
import { db } from "../db";
import { superAdminGuardMiddleware } from "../middlewares/auth";
import { idBlogValidation } from "../middlewares/IdBlogvalidator"
import { blogValidation } from "../middlewares/blogValidator"
import { inputValidationResultMiddleware } from "../middlewares/MainValidator"

export const blogsRouter = Router();


blogsRouter
    .get("", async (req: Request, res: Response) => {
        const blogs = await db.collection("blogs").find({}).toArray();
        res.status(200).send(blogs)
    })

    .get("/:id", idBlogValidation, async (req: Request, res: Response) => {
        const blog = await db.collection("blogs").findOne({ id: req.params.id })

        if (!blog) {
            res.status(404).send({ message: "Blog Not Found" });
            return;
        }

        res.status(200).send(blog);
    })

    .post("", superAdminGuardMiddleware, ...blogValidation, inputValidationResultMiddleware, async (req: Request, res: Response) => {
        const { name, description, websiteUrl } = req.body;

        const newBlog = {
            id: String(Date.now()),
            name,
            description,
            websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        };

        await db.collection("blogs").insertOne(newBlog)
        res.status(201).send(newBlog);
    })

    .put("/:id", superAdminGuardMiddleware, idBlogValidation, ...blogValidation, inputValidationResultMiddleware, async (req: Request, res: Response) => {
        const blog = await db.collection("blogs").findOne({ id: req.params.id })
        const { name, description, websiteUrl } = req.body;

        if (!blog) {
            res.sendStatus(404);
            return;
        }

        await db.collection("blogs").updateOne({ id: req.params.id }, {
            $set: { name, description, websiteUrl }
        })

        res.sendStatus(204);
    })

    .delete("/:id", superAdminGuardMiddleware, idBlogValidation, async (req: Request, res: Response) => {
        const check = await db.collection("blogs").deleteOne({ id: req.params.id });

        if (!check.deletedCount) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    })