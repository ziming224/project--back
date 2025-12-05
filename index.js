import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import { StatusCodes } from 'http-status-codes'
import cors from 'cors'
import userRouter from './routes/user.js'
import productRouter from './routes/product.js'
import orgRouter from './routes/org.js'
import orderRouter from './routes/order.js'
import './passport.js'

// --- MongoDB ---
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log('資料庫連線成功')
    mongoose.set('sanitizeFilter', true)
  })
  .catch((error) => {
    console.log('資料庫連線失敗')
    console.error('資料庫連線失敗', error)
  })

const app = express()

// HEAD / 讓 Render 冷啟動檢查不會報錯
app.head("/", (req, res) => {
  res.status(200).end();
})

// GET / 讓使用者打開根目錄不會 404
app.get("/", (req, res) => {
  res.status(200).send("Server OK");
})

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(cors())

app.use(express.json())
// 如json有誤
app.use((error, req, res, _next) => {
  res.status(StatusCodes.BAD_REQUEST).json({
    success: false,
    message: 'JSON 格式錯誤',
  })
})

// --- 主路由 ---
app.use('/user', userRouter)
app.use('/product', productRouter)
app.use('/org', orgRouter)
app.use('/order', orderRouter)

// 處理未定義的路由
app.all(/.*/, (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: '找不到該路由',
  })
})

app.listen(4000, () => {
  console.log('伺服器啟動')
})
