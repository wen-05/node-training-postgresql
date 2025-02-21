const sendResponse = (res, statusCode, result) => {
  res.status(statusCode).json(result)
}

const handleSuccess = (res, statusCode, data) => {
  sendResponse(res, statusCode, { status: 'success', data })
}

const handleFailed = (res, statusCode, message) => {
  sendResponse(res, statusCode, { status: 'failed', message })
}

module.exports = { handleSuccess, handleFailed }