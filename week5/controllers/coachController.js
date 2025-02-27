const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('Coach')
const { isUndefined, isNotValidString, isNotValidInteger, isNotValidUUID } = require('../utils/valid')
const { handleSuccess, handleFailed } = require('../utils/sendResponse')

const getList = async (req, res, next) => {
  try {
    let { per, page } = req.query
    per = parseInt(per)    // 每頁筆數
    page = parseInt(page)  // 目前分頁

    if (isUndefined(per) || isNotValidInteger(per) ||
      isUndefined(page) || isNotValidInteger(page)) {

      logger.warn('欄位未填寫正確')
      handleFailed(res, 400, '欄位未填寫正確')
      return
    }

    const skip = (page - 1) * per

    const coaches = await dataSource.getRepository('Coach').find({
      select: ['id', 'created_at'],
      take: per,
      skip,
      relations: ['User'],
      order: { created_at: 'DESC' }
    })

    const result = coaches.map(coach => ({
      id: coach.id,
      name: coach.User.name
    }))

    handleSuccess(res, 200, result)
  } catch (error) {
    logger.error(error)
    next(error)
  }
}

const getDetail = async (req, res, next) => {
  try {
    const { coachId } = req.params

    if (isUndefined(coachId) || isNotValidString(coachId) || !isNotValidUUID(coachId)) {

      logger.warn('欄位未填寫正確')
      handleFailed(res, 400, '欄位未填寫正確')
      return
    }

    const coachDetail = await dataSource.getRepository('Coach').findOne({
      where: { id: coachId },
      relations: ['User'],
    })

    if (!coachDetail) {
      logger.warn('找不到該教練')
      handleFailed(res, 400, '找不到該教練')
      return
    }

    const result = {
      user: {
        name: coachDetail.User.name,
        role: coachDetail.User.role
      },
      coach: {
        id: coachDetail.id,
        user_id: coachDetail.user_id,
        experience_years: coachDetail.experience_years,
        description: coachDetail.description,
        profile_image_url: coachDetail.profile_image_url,
        created_at: coachDetail.created_at,
        updated_at: coachDetail.updated_at,
      }
    }

    handleSuccess(res, 200, result)

  } catch (error) {
    logger.error(error)
    next(error)
  }
}

module.exports = { getList, getDetail }