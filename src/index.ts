import express, { Request, Response } from 'express'
import { db } from "./db";

const app = express()
const port = process.env.PORT || 5000

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Samurai')
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})

export default app;