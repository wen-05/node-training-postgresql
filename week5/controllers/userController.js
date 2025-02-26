const bcrypt = require('bcrypt')
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('User')
const { isUndefined, isNotValidString, isValidPassword } = require('../utils/valid')
const { handleSuccess, handleFailed } = require('../utils/sendResponse')

const saltRounds = 10

const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    if (isUndefined(name) || isNotValidString(name) || isUndefined(email) || isNotValidString(email) || isUndefined(password) || isNotValidString(password)) {

      logger.warn('欄位未填寫正確')
      handleFailed(res, 400, '欄位未填寫正確')
      return
    }

    if (!isValidPassword(password)) {
      logger.warn('建立使用者錯誤: 密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字')
      handleFailed(res, 400, '密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字')
      return
    }

    const userRepository = dataSource.getRepository('User')

    // 檢查 email 是否已存在
    const existingUser = await userRepository.findOneBy({ email })

    if (existingUser) {
      logger.warn('建立使用者錯誤: Email 已被使用')
      handleFailed(res, 409, 'Email 已被使用')
      return
    }

    // 建立新使用者
    const hashPassword = await bcrypt.hash(password, saltRounds)
    const newUser = userRepository.create({
      name,
      email,
      role: 'USER',
      password: hashPassword
    })

    const savedUser = await userRepository.save(newUser)
    logger.info('新建立的使用者ID:', savedUser.id)

    handleSuccess(res, 201, {
      user: {
        id: savedUser.id,
        name: savedUser.name
      }
    })
  } catch (error) {
    logger.error('建立使用者錯誤:', error)
    next(error)
  }
}

module.exports = { signup }