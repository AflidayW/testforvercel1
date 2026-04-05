import { Router, Request, Response } from "express";
import { db } from "../db";
export type Blog = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type Post = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}

export const productRepository = {

    async findAllBlogs(req: Request): Promise<{ items: Blog[], totalCount: number, pagesCount: number, page: number, PageSize: number }> {
        const PageSize = Number(req.query.pageSize || 10);
        const PageNumber = Number(req.query.pageNumber || 1);


        const items = await db.collection<Blog>("Blogs").find({}, { projection: { _id: 0 } }).skip((PageNumber - 1) * PageSize).limit(PageSize).toArray();

        const totalCount = await db.collection<Blog>("Blogs").countDocuments({})

        return {
            items,
            totalCount,
            pagesCount: Math.ceil(totalCount / PageSize),
            page: PageNumber,
            PageSize
        }
    },

    async findOneBlog(req: Request): Promise<Blog | null> {
        const FoundedBlog = await db.collection<Blog>("Blogs").findOne({ id: req.params.id }, { projection: { _id: 0 } })
        return FoundedBlog;
    },

    async CreateBlog(req: Request): Promise<Blog> {
        const { name, description, websiteUrl } = req.body;
        const newBlog: Blog = {
            id: String(Date.now()),
            name,
            description,
            websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        };
        await db.collection<Blog>("Blogs").insertOne({ ...newBlog })
        return newBlog;
    },

    async UpdateBlog(req: Request): Promise<Boolean> {
        const { name, description, websiteUrl } = req.body;
        const result = await db.collection<Blog>("Blogs").updateOne({ id: req.params.id }, { $set: { name, description, websiteUrl } })
        return result.matchedCount > 0;
    },

    async DeleteBlog(req: Request): Promise<Number> {
        const Result = await db.collection("Blogs").deleteOne({ id: req.params.id });

        return Result.deletedCount

    },

    async CreatePostforPosts(req: Request): Promise<Post> {
        const { title, shortDescription, content, blogId } = req.body;

        const Blog_post = await db.collection("Blogs").findOne({ id: blogId }, { projection: { _id: 0 } });

        const newPost: Post = {
            id: String(Date.now()),
            title,
            shortDescription,
            content,
            blogId,
            blogName: Blog_post!.name,
            createdAt: new Date().toISOString()
        };

        await db.collection("Posts").insertOne(newPost)
        return newPost;

    },
    async CreatePostForBlog(req: Request): Promise<Post> {
        const { title, shortDescription, content } = req.body;

        const blogId = req.params.id;

        const Blog_post = await db.collection("Blogs").findOne({ id: blogId }, { projection: { _id: 0 } });

        const newPost: Post = {
            id: String(Date.now()),
            title,
            shortDescription,
            content,
            blogId,
            blogName: Blog_post!.name,
            createdAt: new Date().toISOString()
        };

        await db.collection("Posts").insertOne(newPost)
        return newPost;

    },

    async GetPostsFromBlog(req: Request): Promise<{ lists_of_Posts: Post[], totalCount: number, pagesCount: number, page: number, pageSize: number }> {
        const blogId = req.params.id;

        const pageSize = Number(req.query.pageSize || 10);

        const PageNumber = Number(req.query.pageNumber || 1);

        const lists_of_Posts = await db.collection<Post>("Posts").find({ blogId: blogId }, { projection: { _id: 0 } }).skip((PageNumber - 1) * pageSize).limit(pageSize).toArray()

        const totalCount = await db.collection<Post>("Posts").countDocuments({})
        return { lists_of_Posts, totalCount, pagesCount: Math.ceil(totalCount / pageSize), page: PageNumber, pageSize };

    }
}

