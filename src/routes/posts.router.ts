import { Router, Request, Response } from "express";
import { db } from "../db";
import { superAdminGuardMiddleware } from "../middlewares/auth";
import { idPostValidator } from "../middlewares/idPostValidator"
import { postsValidation } from "../middlewares/postsValidator"
import { inputValidationResultMiddleware } from "../middlewares/MainValidator"
import { idBlogValidation } from "../middlewares/IdBlogvalidator";
import { productRepository, Post } from "./product-repository";
import { sortValidator } from "../middlewares/sortvalidation";

import { PaginationValidation } from "../middlewares/Pagination"


export const postsRouter = Router();

postsRouter
    .get("", PaginationValidation(), ...sortValidator, inputValidationResultMiddleware, async (req: Request, res: Response) => {
        const posts = productRepository.findAllPosts(req);
        res.status(200).send(posts);

    })

    .get("/:id", idPostValidator, inputValidationResultMiddleware, async (req: Request, res: Response) => {
        const post = await db.collection("Posts").findOne({ id: req.params.id }, { projection: { _id: 0 } });

        if (!post) {
            res.status(404).send({ message: "Post not Found" });
            return;
        }

        res.status(200).send(post)

    }

    )
    .post("", superAdminGuardMiddleware, ...postsValidation, inputValidationResultMiddleware, async (req: Request, res: Response) => {
        // const { title, shortDescription, content, blogId } = req.body;
        // const blogName = await db.collection("Blogs").findOne({ id: blogId }, { projection: { _id: 0 } });
        // const newPost = {
        //     id: String(Date.now()),
        //     title,
        //     shortDescription,
        //     content,
        //     blogId,
        //     blogName: blogName!.name,
        //     createdAt: new Date().toISOString()
        // }
        const newPost = await productRepository.CreatePostforPosts(req);
        res.status(201).send(newPost);
    })


    .put("/:id", superAdminGuardMiddleware, idPostValidator, ...postsValidation, inputValidationResultMiddleware, async (req: Request, res: Response) => {
        try {
            const post = await db.collection("Posts").findOne({ id: req.params.id }, { projection: { _id: 0 } });
            const { title, shortDescription, content, blogId } = req.body;

        if (!post) {
            res.status(404).send({ message: "Post not Found" });
            return;
        }

        const blog = await db.collection("Blogs").findOne({ id: blogId });

            if (!blog) {
                res.status(400).send({ message: "Blog not Found" })
                return;
            }

        await db.collection("Posts").updateOne({ id: req.params.id }, {
            $set: { title, shortDescription, content, blogId, blogName: blog.name }
        })

        res.sendStatus(204);

        }
        catch (e) {
            res.status(500).send({ message: "Server Error" })
        }

    })



    .delete("/:id", superAdminGuardMiddleware, idPostValidator, inputValidationResultMiddleware, async (req: Request, res: Response) => {
        const result = await db.collection("Posts").deleteOne({ id: req.params.id });

        if (!result.deletedCount) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    });