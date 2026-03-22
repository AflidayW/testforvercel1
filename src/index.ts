import express, { Request, Response } from 'express'
import { db, runDb } from "./db";
// import { videoRouter } from './routes/video.router'
import { setupSwagger } from './swagger'
import { blogsRouter } from "./routes/blogs.router"
import {postsRouter} from "./routes/posts.router"


const app = express()
const port = process.env.PORT || 5000
app.use(async (req, res, next) => {
  await runDb();
  next();
});
app.use(express.json());
app.get('/', (req: Request, res: Response) => {
  res.send('Hello Samurai')
})
// app.use("/videos", videoRouter)
app.use("/blogs", blogsRouter)
app.use("/posts", postsRouter)


// 

app.delete("/testing/all-data", async (req: Request, res: Response) => {
  await db.collection("videos").deleteMany({});
  await db.collection("posts").deleteMany({});
  await db.collection("blogs").deleteMany({})
  res.sendStatus(204);
});
setupSwagger(app);

const StartApp = async () => {
  await runDb();
  app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});
}

StartApp();

export default app;