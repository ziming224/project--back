import Org from '../models/org.js'
import { StatusCodes } from 'http-status-codes'
import validator from 'validator'

export const create = async (req, res) => {
  try {
    const org = await Org.create({
      name: req.body.name,
      category: req.body.category,
      address: req.body.address,
      phone: req.body.phone,
      mail: req.body.mail,
      fb: req.body.fb,
      website: req.body.website,
      openingHours: req.body.openingHours,
      description: req.body.description,
      image: req.file?.path,
      sell: req.body.sell,
    })
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: '單位建立成功',
      org,
    })
  } catch (error) {
    console.log('controllers/org.js create')
    console.error(error)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.errors[key].message,
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '伺服器內部錯誤',
      })
    }
  }
}

// 取得所有單位
export const getAll = async (req, res) => {
  try {
    const orgs = await Org.find()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '單位列表取得成功',
      orgs,
    })
  } catch (error) {
    console.log('controllers/org.js getAll')
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器內部錯誤',
    })
  }
}
// 取架上單位
export const get = async (req, res) => {
  try {
    const orgs = await Org.find({ sell: true })
    res.status(StatusCodes.OK).json({
      success: true,
      message: '單位列表取得成功',
      orgs,
    })
  } catch (error) {
    console.log('controllers/org.js getAll')
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器內部錯誤',
    })
  }
}

export const update = async (req, res) => {
  try {
    // 檢查單位 ID 是否有效
    if (!validator.isMongoId(req.params.id)) {
      throw new Error('ORG ID')
    }

    const org = await Org.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        // 更新不一定要傳圖片，沒有傳圖片就是用舊的
        // 如果沒有傳圖片，就不會有 req.file，就會是 undefined，不會更新
        // 如果有傳圖片，就會用新的圖片路徑
        image: req.file?.path,
      },
      {
        new: true,
        runValidators: true,
      },
    ).orFail(new Error('ORG NOT FOUND'))

    res.status(StatusCodes.OK).json({
      success: true,
      message: '單位更新成功',
      org,
    })
  } catch (error) {
    console.log('controllers/org.js update')
    console.error(error)
    if (error.message === 'ORG ID') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '無效的單位 ID',
      })
    } else if (error.message === 'ORG NOT FOUND') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '單位不存在',
      })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.errors[key].message,
      })
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '伺服器內部錯誤',
      })
    }
  }
}

export const getId = async (req, res) => {
  try {
    // 檢查單位 ID 是否有效
    if (!validator.isMongoId(req.params.id)) {
      throw new Error('ORG ID')
    }

    const org = await Org.findById(req.params.id).orFail(new Error('ORG NOT FOUND'))

    res.status(StatusCodes.OK).json({
      success: true,
      message: '單位取得成功',
      org,
    })
  } catch (error) {
    console.log('controllers/org.js getId')
    console.error(error)
    if (error.message === 'ORG ID') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '無效的單位 ID',
      })
    } else if (error.message === 'ORG NOT FOUND') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '單位不存在',
      })
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '伺服器內部錯誤',
      })
    }
  }
}
