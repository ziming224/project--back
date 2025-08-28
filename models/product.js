import { Schema, model } from 'mongoose'

const schema = new Schema(
  {
    name: {
      type: String,
      required: [true, '商品名稱是必填的'],
      trim: true,
      minlength: [1, '商品名稱至少需要 1 個字元'],
      maxlength: [100, '商品名稱最多只能有 100 個字元'],
    },
    price: {
      type: Number,
      required: [true, '價格是必填的'],
      min: [0, '價格不能為負數'],
    },
    stock: {
      type: Number,
      required: [true, '庫存是必填的'],
      min: [0, '庫存不能為負數'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, '描述最多只能有 500 個字元'],
    },
    sell: {
      type: Boolean,
      default: true,
      required: [true, '是否上架是必填的'],
    },
    image: {
      type: String,
      required: [true, '商品圖片是必填的'],
    },
  },
  { versionKey: false, timestamps: true },
)

export default model('products', schema)
