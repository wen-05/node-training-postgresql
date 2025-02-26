const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('Skill')
const { isUndefined, isNotValidString } = require('../utils/valid')
const { handleSuccess, handleFailed } = require('../utils/sendResponse')

const getSkill = async (req, res, next) => {
  try {
    const skill = await dataSource.getRepository('Skill').find({
      select: ['id', 'name']
    })

    handleSuccess(res, 200, skill)

  } catch (error) {
    logger.error(error)
    next(error)
  }
}

const createSkill = async (req, res, next) => {
  try {
    const { name } = req.body
    if (isUndefined(name) || isNotValidString(name)) {
      handleFailed(res, 400, '欄位未填寫正確')
      return
    }

    const skillRepo = dataSource.getRepository('Skill')
    const existSkill = await skillRepo.findBy({ name })

    if (existSkill.length > 0) {
      handleFailed(res, 409, '資料重複')
      return
    }

    const newSkill = skillRepo.create({
      name
    })

    const result = await skillRepo.save(newSkill)
    handleSuccess(res, 200, result)

  } catch (error) {
    logger.error(error)
    next(error)
  }
}

const deleteSkill = async (req, res, next) => {
  try {
    const skillId = req.url.split('/').pop()

    if (isUndefined(skillId) || isNotValidString(skillId)) {
      handleFailed(res, 400, 'ID錯誤')
      return
    }

    const result = await dataSource.getRepository('Skill').delete(skillId)
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

module.exports = { getSkill, createSkill, deleteSkill }