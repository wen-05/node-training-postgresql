const { DataSource } = require('typeorm')
const config = require('../config/index')

const CreditPackage = require('../entities/CreditPackages.entity')
const Skill = require('../entities/Skill.entity')
const User = require('../entities/User.entity')
const Coach = require('../entities/Coach.entity')
const Course = require('../entities/Course.entity')

const dataSource = new DataSource({
  type: 'postgres',
  host: config.get('db.host'),
  port: config.get('db.port'),
  username: config.get('db.username'),
  password: config.get('db.password'),
  database: config.get('db.database'),
  synchronize: config.get('db.synchronize'),
  poolSize: 10,
  entities: [
    CreditPackage, Skill, User, Coach, Course
  ],
  ssl: config.get('db.ssl')
})

module.exports = { dataSource }
