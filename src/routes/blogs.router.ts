import { Router, Request, Response } from "express";
import { db } from "../db";
import { superAdminGuardMiddleware } from "../middlewares/auth";
import { idBlogValidation } from "../middlewares/IdBlogvalidator"
import { blogValidation } from "../middlewares/blogValidator"
import { inputValidationResultMiddleware } from "../middlewares/MainValidator"
import { productRepository } from "../routes/product-repository"
import { postsValidation } from "../middlewares/postsValidator";
import {sortValidator} from "../middlewares/sortvalidation"
import { PaginationValidation } from "../middlewares/Pagination";

export const blogsRouter = Router();


blogsRouter
    .get("", PaginationValidation(), ...sortValidator, inputValidationResultMiddleware, async (req: Request, res: Response) => {
        const blogs = await productRepository.findAllBlogs(req);
        res.status(200).send(blogs)
    })

    .get("/:id", idBlogValidation, inputValidationResultMiddleware, async (req: Request, res: Response) => {
        const blog = await productRepository.findOneBlog(req);

        if (!blog) {
            res.status(404).send({ message: "Blog Not Found" });
            return;
        }

        res.status(200).send(blog);
    })

    .get("/:id/posts", idBlogValidation,...sortValidator, inputValidationResultMiddleware, async (req: Request, res: Response) => {
        const Posts = await productRepository.GetPostsFromBlog(req);

        res.status(200).send(Posts)
    })

    .post("", superAdminGuardMiddleware, ...blogValidation, inputValidationResultMiddleware, async (req: Request, res: Response) => {
        // const { name, description, websiteUrl } = req.body;

        // const newBlog = {
        //     id: String(Date.now()),
        //     name,
        //     description,
        //     websiteUrl,
        //     createdAt: new Date().toISOString(),
        //     isMembership: false
        // };

        // await db.collection("Blogs").insertOne(newBlog)
        // const { _id, ...BlogWithoutId } = newBlog as any;

        // res.status(201).send(BlogWithoutId);
        const newBlog = await productRepository.CreateBlog(req)
        res.status(201).send(newBlog)
    })

    .post("/:id/posts", superAdminGuardMiddleware, idBlogValidation, ...postsValidation, inputValidationResultMiddleware, async (req: Request, res: Response) => {
        const newPost = await productRepository.CreatePostForBlog(req);

        res.status(201).send(newPost)
    })


    .put("/:id", superAdminGuardMiddleware, idBlogValidation, ...blogValidation, inputValidationResultMiddleware, async (req: Request, res: Response) => {

        // const { name, description, websiteUrl } = req.body;
        // if (!blog) {
        //     res.sendStatus(404);
        //     return;
        // }

        // await db.collection("Blogs").updateOne({ id: req.params.id }, {
        //     $set: { name, description, websiteUrl }
        // })
        // const blog = productRepository.findOneBlog(req);
        // if (!blog) {
        //     res.sendStatus(404);
        //     return;
        // }
        await productRepository.UpdateBlog(req)
        res.sendStatus(204);
    })

    .delete("/:id", superAdminGuardMiddleware, idBlogValidation, async (req: Request, res: Response) => {
        const result = await productRepository.DeleteBlog(req);
        if (!result) {
            res.sendStatus(404)
            return;
        }
        res.sendStatus(204);
    })