const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('CreditPackage')
const { isUndefined, isNotValidString, isNotValidInteger } = require('../utils/valid')
const { handleSuccess, handleFailed } = require('../utils/sendResponse')

const getCreditPackage = async (req, res, next) => {
  try {
    const creditPackage = await dataSource.getRepository('CreditPackage').find({
      select: ['id', 'name', 'credit_amount', 'price']
    })

    handleSuccess(res, 200, creditPackage)

  } catch (error) {
    logger.error(error)
    next(error)
  }
}

const createCreditPackage = async (req, res, next) => {
  try {
    const { name, credit_amount: creditAmount, price } = req.body

    if (isUndefined(name) || isNotValidString(name) ||
      isUndefined(creditAmount) || isNotValidInteger(creditAmount) ||
      isUndefined(price) || isNotValidInteger(price)) {

      handleFailed(res, 400, '欄位未填寫正確')
      return
    }

    const creditPurchaseRepo = dataSource.getRepository('CreditPackage')
    const existCreditPurchase = await creditPurchaseRepo.findBy({ name })

    if (existCreditPurchase.length > 0) {
      handleFailed(res, 409, '資料重複')
      return
    }

    const newCreditPurchase = creditPurchaseRepo.create({
      name,
      credit_amount: creditAmount,
      price
    })

    const result = await creditPurchaseRepo.save(newCreditPurchase)
    handleSuccess(res, 201, result)

  } catch (error) {
    logger.error(error)
    next(error)
  }
}

const deleteCreditPackage = async (req, res, next) => {
  try {
    const { creditPackageId } = req.params

    if (isUndefined(creditPackageId) || isNotValidString(creditPackageId)) {
      handleFailed(res, 400, '欄位未填寫正確')
      return
    }

    const result = await dataSource.getRepository('CreditPackage').delete(creditPackageId)

    if (result.affected === 0) {
      handleFailed(res, 400, 'ID錯誤')
      return
    }

    handleSuccess(res, 200, result)

  } catch (error) {
    logger.error(error)
    next(error)
  }
}

module.exports = { getCreditPackage, createCreditPackage, deleteCreditPackage }