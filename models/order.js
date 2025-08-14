import { Schema, model } from 'mongoose'

const cartSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'products',
      required: [true, '商品 ID 是必填的'],
    },
    quantity: {
      type: Number,
      required: [true, '數量必填'],
      min: [1, '數量最少為 1'],
    },
  },
  { versionKey: false },
)

const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: [true, '使用者 ID 是必填的'],
    },
    cart: {
      type: [cartSchema],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

export default model('orders', schema)
