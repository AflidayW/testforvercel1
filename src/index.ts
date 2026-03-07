import express, { Request, Response } from 'express'
import { db } from "./db";
import { resolve } from 'path';
import { videoRouter } from './video.router'

const app = express()
const port = process.env.PORT || 5000
app.use(express.json());
app.get('/', (req: Request, res: Response) => {
  res.send('Hello Samurai')
})

app.use("/videos", videoRouter)


// 

app.delete("/testing/all-data", (req: Request, res: Response) => {
  db.videos = [];
  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});

export default app;