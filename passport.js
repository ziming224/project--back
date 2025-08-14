import passport from 'passport'
import passportLocal from 'passport-local'
import passportJWT from 'passport-jwt'
import bcrypt from 'bcrypt'
import User from './models/user.js'

// 定義自己的驗證方法
// passport.use(驗證方法名稱, 驗證策略(策略設定, 策略執行完的處理))
// passportLocal = 帳號密碼驗證策略，檢查有沒有指定的帳號密碼欄位
passport.use(
  'login',
  new passportLocal.Strategy(
    {
      // 預設檢查 username 和 password 欄位
      // 可以修改檢查的欄位名稱
      usernameField: 'account',
      passwordField: 'password',
    },
    // 檢查完帳號密碼欄位有資料後的處理
    // account = 帳號欄位，password = 密碼欄位
    // done = 驗證方法執行完成，繼續並把結果帶到下一步
    // done(錯誤, 使用者資料, info)
    async (account, password, done) => {
      try {
        // 檢查帳號是否存在
        const user = await User.findOne({ $or: [{ account: account }, { email: account }] }).orFail(new Error('USER NOT FOUND'))
        // 檢查密碼是否正確
        if (!bcrypt.compareSync(password, user.password)) {
          throw new Error('PASSWORD')
        }
        // 驗證成功，把使用者資料帶到下一步
        return done(null, user)
      } catch (error) {
        console.log('passport.js login')
        console.error(error)
        // 驗證失敗，把錯誤和訊息帶到下一步
        if (error.message === 'USER NOT FOUND') {
          return done(null, false, { message: '使用者不存在' })
        } else if (error.message === 'PASSWORD') {
          return done(null, false, { message: '密碼錯誤' })
        } else {
          return done(error)
        }
      }
    },
  ),
)

passport.use(
  'jwt',
  new passportJWT.Strategy(
    {
      // 從哪去取jwt
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      // 將req傳至async
      passReqToCallback: true,
      // 忽略過期時間，因為舊換新的時候可以允許過期的 token
      ignoreExpiration: true,
    },
    // req 必須要設定 passReqToCallback 才能使用
    // 因為套件只給解編後的 jwt 內容，不會給原本的 jwt，所以需要自己從 req 裡面拿
    // payload = JWT 的內容
    // done = 跟上面一樣
    async (req, payload, done) => {
      try {
        // 從 req 的 headers 裡面拿到 token
        // req.headers.authorization 的格式是 'Bearer token'
        // const token = req.headers.authorization.split(' ')[1]
        const token = passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()(req)

        // 手動檢查過期
        // 只有 refresh 和 logout 可以允許過期的 token
        // payload.exp 是 JWT 的過期時間，單位是秒，所以要乘以 1000 轉成毫秒
        // Date.now() 是現在的時間，單位是毫秒
        const expired = payload.exp * 1000 < Date.now()
        // 請求的路徑
        // http://localhost:4000/user/abcd?aaa=111&bbb=222
        // req.originUrl = /user/abcd?aaa=111&bbb=222
        // req.baseUrl = /user
        // req.path = /abcd
        // req.query = { aaa: '111', bbb: '222' }
        const url = req.baseUrl + req.path
        if (expired && url !== '/user/refresh' && url !== '/user/logout') {
          throw new Error('TOKEN EXPIRED')
        }

        // 檢查使用者是否存在，並且 tokens 裡面有這個 token
        const user = await User.findOne({ _id: payload._id, tokens: token }).orFail(
          new Error('USER NOT FOUND'),
        )
        return done(null, { user, token })
      } catch (error) {
        console.log('passport.js jwt')
        console.error(error)
        if (error.message === 'USER NOT FOUND') {
          return done(null, false, { message: '使用者不存在或 token 已失效' })
        } else if (error.message === 'TOKEN EXPIRED') {
          return done(null, false, { message: 'token 已過期' })
        } else {
          return done(error)
        }
      }
    },
  ),
)
