import { Router, Request, Response } from "express";
import { db } from "../db";
import { superAdminGuardMiddleware } from "../middlewares/auth";
import { idValidation } from "../middlewares/Idvalidator"
import { postsValidation } from "../middlewares/postsValidator"
import { inputValidationResultMiddleware } from "../middlewares/MainValidator"

export const postsRouter = Router();

postsRouter
    .get("", (req: Request, res: Response) => {

        res.status(200).send(db.posts);

    })

    .get("/:id", (req: Request, res: Response) => {
        const post = db.posts.find(id => id.id === +req.params.id);

        if (!post) {
            res.status(404).send({ message: "Post not Found" });
            return;
        }

        res.status(200).send(post)

    }

    )
    .post("", superAdminGuardMiddleware, ...postsValidation, inputValidationResultMiddleware, (req: Request, res: Response) => {
        const { title, shortDescription, content, blogId } = req.body;

        const newPost = {
            id: db.posts.length ? db.posts[db.posts.length - 1].id + 1 : 1,
            title,
            shortDescription,
            content,
            blogId,
            createdAt: new Date().toISOString(),
            blogName: db.blogs.find(ojbect => ojbect.id === blogId)!.name
        }

        db.posts.push(newPost);
        res.status(201).send(newPost);
    })


    .put("/:id", superAdminGuardMiddleware, idValidation, ...postsValidation, inputValidationResultMiddleware, (req: Request, res: Response) => {
        const post = db.posts.find(id => id.id === +req.params.id);
        const { title, shortDescription, content, blogId } = req.body;
        if (!post) {
            res.status(404).send({ message: "Post not Found" });
            return;
        }

        post.title = title;

        post.shortDescription = shortDescription;

        post.content = content;

        post.blogId = blogId;

        post.blogName = db.blogs.find(ojbect => ojbect.id === blogId)!.name;

        res.sendStatus(204);

    })



    .delete("/:id", superAdminGuardMiddleware, idValidation, inputValidationResultMiddleware, (req: Request, res: Response) => {
        const check = db.posts.find(b => b.id === +req.params.id);

        if (!check) {
            res.sendStatus(404);
            return;
        }

        db.posts = db.posts.filter(b => b.id !== +req.params.id);
        res.sendStatus(204);
    });