require("dotenv").config()
const http = require("http")
const AppDataSource = require("./db")

function isUndefined(value) {
  return value === undefined
}

function isNotValidString(value) {
  return typeof value !== "string" || value.trim().length === 0 || value === ""
}

function isNotValidInteger(value) {
  return typeof value !== "number" || value < 0 || value % 1 !== 0
}

const requestListener = async (req, res) => {
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json"
  }
  let body = ""
  req.on("data", (chunk) => {
    body += chunk
  })

  const sendResponse = (res, statusCode, data) => {
    res.writeHead(statusCode, headers)
    res.write(JSON.stringify(data))
    res.end()
  }

  if (req.url === "/api/credit-package" && req.method === "GET") {
    try {
      const packages = await AppDataSource.getRepository("CreditPackage").find({
        select: ["id", "name", "credit_amount", "price"]
      })
      sendResponse(res, 200, { status: "success", data: packages })

    } catch (error) {
      sendResponse(res, 500, { status: "error", message: "伺服器錯誤" })

    }
  } else if (req.url === "/api/credit-package" && req.method === "POST") {
    req.on("end", async () => {
      try {
        const data = JSON.parse(body)
        if (isUndefined(data.name) || isNotValidString(data.name) ||
          isUndefined(data.credit_amount) || isNotValidInteger(data.credit_amount) ||
          isUndefined(data.price) || isNotValidInteger(data.price)) {
          sendResponse(res, 400, { status: "failed", message: "欄位未填寫正確" })

          return
        }
        const creditPackageRepo = await AppDataSource.getRepository("CreditPackage")
        const existPackage = await creditPackageRepo.find({
          where: {
            name: data.name
          }
        })
        if (existPackage.length > 0) {
          sendResponse(res, 409, { status: "failed", message: "資料重複" })

          return
        }
        const newPackage = await creditPackageRepo.create({
          name: data.name,
          credit_amount: data.credit_amount,
          price: data.price
        })
        const result = await creditPackageRepo.save(newPackage)
        sendResponse(res, 200, { status: "success", data: result })

      } catch (error) {
        sendResponse(res, 500, { status: "error", message: "伺服器錯誤" })

      }
    })
  } else if (req.url.startsWith("/api/credit-package/") && req.method === "DELETE") {
    try {
      const packageId = req.url.split("/").pop()
      if (isUndefined(packageId) || isNotValidString(packageId)) {
        sendResponse(res, 400, { status: "failed", message: "ID錯誤" })

        return
      }
      const result = await AppDataSource.getRepository("CreditPackage").delete(packageId)
      if (result.affected === 0) {
        sendResponse(res, 400, { status: "failed", message: "ID錯誤" })

        return
      }
      sendResponse(res, 200, { status: "success" })

    } catch (error) {
      sendResponse(res, 500, { status: "error", message: "伺服器錯誤" })

    }
  } else if (req.url === "/api/coaches/skill" && req.method === "GET") {
    try {
      const skills = await AppDataSource.getRepository("Skill").find({
        select: ["id", "name"]
      })
      sendResponse(res, 200, { status: "success", data: skills })

    } catch (error) {
      sendResponse(res, 500, { status: "error", message: "伺服器錯誤" })

    }
  } else if (req.url === "/api/coaches/skill" && req.method === "POST") {
    req.on("end", async () => {
      try {
        const data = JSON.parse(body)
        if (isUndefined(data.name) || isNotValidString(data.name)) {
          sendResponse(res, 400, { status: "failed", message: "欄位未填寫正確" })

          return
        }
        const skillRepo = await AppDataSource.getRepository("Skill")
        const existSkill = await skillRepo.find({
          where: {
            name: data.name
          }
        })
        if (existSkill.length > 0) {
          sendResponse(res, 409, { status: "failed", message: "資料重複" })

          return
        }
        const newSkill = await skillRepo.create({
          name: data.name,
        })
        const result = await skillRepo.save(newSkill)
        sendResponse(res, 200, { status: "success", data: result })

      } catch (error) {
        sendResponse(res, 500, { status: "error", message: "伺服器錯誤" })

      }
    })
  } else if (req.url.startsWith("/api/coaches/skill/") && req.method === "DELETE") {
    try {
      const skillId = req.url.split("/").pop()
      if (isUndefined(skillId) || isNotValidString(skillId)) {
        sendResponse(res, 400, { status: "failed", message: "ID錯誤" })

        return
      }
      const result = await AppDataSource.getRepository("Skill").delete(skillId)
      if (result.affected === 0) {
        sendResponse(res, 400, { status: "failed", message: "ID錯誤" })

        return
      }
      sendResponse(res, 200, { status: "success" })

    } catch (error) {
      sendResponse(res, 500, { status: "error", message: "伺服器錯誤" })

    }
  } else if (req.method === "OPTIONS") {
    sendResponse(res, 200, {})

  } else {
    sendResponse(res, 404, { status: "failed", message: "無此網站路由" })

  }
}

const server = http.createServer(requestListener)

async function startServer() {
  await AppDataSource.initialize()
  console.log("資料庫連接成功")
  server.listen(process.env.PORT)
  console.log(`伺服器啟動成功, port: ${process.env.PORT}`)
  return server;
}

module.exports = startServer();