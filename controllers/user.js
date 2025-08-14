import User from '../models/user.js'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'

export const create = async (req, res) => {
  try {
    await User.create({
      account: req.body.account,
      email: req.body.email,
      password: req.body.password,
    })
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: '',
    })
  } catch (error) {
    console.log('controllers/user.js create')
    console.error(error)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.errors[key].message,
      })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: '使用者已存在',
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '伺服器內部錯誤',
      })
    }
  }
}

// await 只能加在 async function 內，且 await 只能加在 Promise 函式
export const login = async (req, res) => {
  try {
    // https://github.com/auth0/node-jsonwebtoken?tab=readme-ov-file#jwtsignpayload-secretorprivatekey-options-callback
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens.push(token)
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '登入成功',
      user: {
        account: req.user.account,
        role: req.user.role,
        cartTotal: req.user.cartTotal,
        token,
      },
    })
  } catch (error) {
    console.log('controllers/user.js login')
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器內部錯誤',
    })
  }
}

export const profile = (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    user: {
      account: req.user.account,
      role: req.user.role,
      cartTotal: req.user.cartTotal,
    },
  })
}

// 換新token
export const refresh = async (req, res) => {
  try {
    const i = req.user.tokens.indexOf(req.token)
    // 尋找原本的token為陣列中的哪個
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    // 新token
    req.user.tokens[i] = token
    // 換成新的token
    await req.user.save()
    // 保存新token
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      token,
    })
    // 新token丟回前端
  } catch (error) {
    console.log('controllers/user.js refresh')
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器內部錯誤',
    })
  }
}

export const logout = async (req, res) => {
  try {
    // 從 tokens 中移除當前的 token
    req.user.tokens = req.user.tokens.filter((token) => token !== req.token)
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
    })
  } catch (error) {
    console.log('controllers/user.js logout')
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '伺服器內部錯誤',
    })
  }
}
