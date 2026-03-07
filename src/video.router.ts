import { Router, Request, Response } from "express";
import { db } from "./db";



export const videoRouter = Router();


videoRouter
    .get("", (req: Request, res: Response) => {
        res.status(200).send(db)
    })

    .get("/:id", (req: Request, res: Response) => {
        const videoId = db.videos.find(f_video => f_video.id === +req.params.id);

        if (!videoId) {
            res.status(404).send({ message: "Video Not Found" });
            return;
        }

        res.status(200).send(videoId);
    })

    .post("/videos", (req: Request, res: Response) => {
        const { title, author, availableResolutions, canBeDownloaded } = req.body;
        const errors: { field: string, message: string }[] = [];
        const validResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];
        if (!title || title.trim() === "" || title.length > 40) {
            errors.push({ field: "title", message: "Invalid title" });
        }

        if (canBeDownloaded !== undefined && typeof canBeDownloaded !== "boolean") {
            errors.push({ field: "canBeDownloaded", message: "Invalid canBeDownloaded" });
        }
        if (!author || author.trim() === "" || author.length > 20) {
            errors.push({ field: "author", message: "Invalid author" });
        }

        if (!availableResolutions || !Array.isArray(availableResolutions) || availableResolutions.length === 0 || !availableResolutions.every((resolut: string) => validResolutions.includes(resolut))) {
            errors.push({ field: "availableResolutions", message: "Invalid resolutions" });
        }

        if (errors.length > 0) {
            res.status(400).send({ errorsMessages: errors });
            return;
        }

        const newVideo = {
            id: db.videos.length ? db.videos[db.videos.length - 1].id + 1 : 1,
            title,
            author,
            canBeDownloaded: canBeDownloaded ?? false,
            minAgeRestriction: null,
            createdAt: new Date().toISOString(),
            publicationDate: new Date(Date.now() + 86400000).toISOString(),
            availableResolutions
        };

        db.videos.push(newVideo);
        res.status(201).send(newVideo);
    })

    .put("/videos/:id", (req: Request, res: Response) => {
        const video = db.videos.find(v => v.id === +req.params.id);
        const { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate } = req.body;
        const errors: { field: string, message: string }[] = [];

        if (!video) {
            res.sendStatus(404);
            return;
        }
        if (canBeDownloaded !== undefined && typeof canBeDownloaded !== "boolean") {
            errors.push({ field: "canBeDownloaded", message: "Invalid canBeDownloaded" });
        }
        if (!title || title.trim() === "" || title.length > 40) {
            errors.push({ field: "title", message: "Invalid title" });
        }
        if (!author || author.trim() === "" || author.length > 20) {
            errors.push({ field: "author", message: "Invalid author" });
        }
        if (!availableResolutions || !Array.isArray(availableResolutions) || availableResolutions.length === 0) {
            errors.push({ field: "availableResolutions", message: "Invalid resolutions" });
        }
        if (minAgeRestriction !== null && (typeof minAgeRestriction !== "number" || minAgeRestriction < 1 || minAgeRestriction > 18)) {
            errors.push({ field: "minAgeRestriction", message: "Invalid minAgeRestriction" })
        }
        if (publicationDate !== undefined && typeof publicationDate !== "string") {
            errors.push({ field: "publicationDate", message: "Invalid publicationDate" });
        }
        if (errors.length > 0) {
            res.status(400).send({ errorsMessages: errors });
            return;
        }

        video.title = title ?? video.title;
        video.author = author ?? video.author;
        video.availableResolutions = availableResolutions ?? video.availableResolutions;
        video.canBeDownloaded = canBeDownloaded ?? video.canBeDownloaded;
        video.minAgeRestriction = minAgeRestriction ?? video.minAgeRestriction;
        video.publicationDate = publicationDate ?? video.publicationDate;

        res.sendStatus(204);
    })

    .delete("/videos/:id", (req: Request, res: Response) => {
        const check = db.videos.find(v => v.id === +req.params.id);

        if (!check) {
            res.sendStatus(404);
            return;
        }

        db.videos = db.videos.filter(v => v.id !== +req.params.id);
        res.sendStatus(204);
    });   