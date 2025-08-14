import { Schema, model } from 'mongoose'

const schema = new Schema(
  {
    name: {
      type: String,
      required: [true, '單位名稱是必填的'],
      trim: true,
      minlength: [1, '單位名稱至少需要 1 個字元'],
      maxlength: [100, '單位名稱最多只能有 100 個字元'],
    },
    category: {
      type: String,
      required: [true, '分類是必填的'],
      enum: {
        values: ['北部', '中部', '南部'],
        message: '請選擇有效的區域',
      },
    },
    address: {
      type: String,
      required: [true, '地址是必填的'],
      trim: true,
      minlength: [1, '地址至少需要 1 個字元'],
      maxlength: [100, '地址最多只能有 100 個字元'],
    },

    phone: {
      type: String,
      required: [true, '電話是必填的'],
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
      required: [true, '單位圖片是必填的'],
    },
  },
  { versionKey: false, timestamps: true },
)

export default model('orgs', schema)
