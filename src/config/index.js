import path from 'path'

const MONGO_USERNAME = process.env.DB_USER || 'test'
const MONGO_PASSWORD = process.env.DB_PASS || '123456'
const MONGO_HOSTNAME = process.env.DB_HOST || 'localhost'
const MONGO_PORT = process.env.DB_PORT || '10050'
const DB_NAME = process.env.DB_NAME || 'testdb'

const DB_URL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${DB_NAME}`

// console.log('DB_URL', DB_URL)

const REDIS = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 10051,
  password: process.env.REDIS_PASS || '123456'
}

const JWT_SECRET = '&Vi%33pG2mD51xMo%OUOTo$ZWOa3TYt328tcjXtW9&hn%AOb9quwaZaRMf#f&44c'

const baseUrl = process.env.NODE_ENV === 'production' ? 'https://burgeon.da156.com' : 'http://localhost:8081'

const uploadPath = process.env.NODE_ENV === 'production' ? '/app/public' : path.join(path.resolve(__dirname), '../../public')

const publicPath = [/^\/public/, /^\/login/]

const isDevMode = process.env.NODE_ENV !== 'production'

const port = 3002
const wsPort = 3003

export default {
  DB_NAME,
  MONGO_HOSTNAME,
  DB_URL,
  REDIS,
  JWT_SECRET,
  baseUrl,
  uploadPath,
  publicPath,
  isDevMode,
  port,
  wsPort

}
