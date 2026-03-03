import express, { Request, Response } from 'express'
import { db } from "./db";

const app = express()
const port = process.env.PORT || 5000
app.use(express.json());
app.get('/', (req: Request, res: Response) => {
  res.send('Hello Samurai')
})
app.get("/videos", (req: Request, res: Response) => {
        res.status(200).send(db.videos);
    });
app.get("/videos/:id", (req: Request, res: Response) => {
  const video = db.videos.find(f_video => f_video.id === +req.params.id);

  if (!video) {
    res.status(404).send({ message: "Video Not Found" });
    return;
  }

  res.status(200).send(video);
});
app.post("/videos", (req: Request, res: Response) => {
  const { title, author, availableResolutions } = req.body;
  const errors: { field: string, message: string }[] = [];

  if (!title || title.trim() === "" || title.length > 40) {
    errors.push({ field: "title", message: "Invalid title" });
  }

  if (!author || author.trim() === "" || author.length > 20) {
    errors.push({ field: "author", message: "Invalid author" });
  }

  if (!availableResolutions || !Array.isArray(availableResolutions) || availableResolutions.length === 0) {
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
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: new Date().toISOString(),
    publicationDate: new Date().toISOString(),
    availableResolutions
  };

  db.videos.push(newVideo);
  res.status(201).send(newVideo);
});
app.put("/videos/:id", (req: Request, res: Response) => {
  const video = db.videos.find(v => v.id === +req.params.id);
  const { title, author, availableResolutions, canBeDownloaded, minAgeRestriction } = req.body;
  const errors: { field: string, message: string }[] = [];

  if (!video) {
    res.sendStatus(404);
    return;
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

  if (errors.length > 0) {
    res.status(400).send({ errorsMessages: errors });
    return;
  }

  video.title = title ?? video.title;
  video.author = author ?? video.author;
  video.availableResolutions = availableResolutions ?? video.availableResolutions;
  video.canBeDownloaded = canBeDownloaded ?? video.canBeDownloaded;
  video.minAgeRestriction = minAgeRestriction ?? video.minAgeRestriction;

  res.sendStatus(204);
});
// ИСПРАВЛЕНО: "vedios" -> "videos"
app.delete("/videos/:id", (req: Request, res: Response) => {
  const check = db.videos.find(v => v.id === +req.params.id);

  if (!check) {
    res.sendStatus(404);
    return;
  }

  db.videos = db.videos.filter(v => v.id !== +req.params.id);
  res.sendStatus(204);
});

app.delete("/testing/all-data", (req: Request, res: Response) => {
  db.videos = [];
  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});

export default app;