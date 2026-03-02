import express, { Request, Response } from 'express'

const app = express()
const port = 5000

// Главный и единственный эндпоинт
app.get('/', (req: Request, res: Response) => {
  res.send('Hello Samurai')
})

// Запуск сервера без лишних проверок БД
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})