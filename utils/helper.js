import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { SECRET } from './config.js'
import RefreshTokenModel from '../models/refresh-token.model.js'
const saltRounds = 10

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(saltRounds)
  const passwordHash = await bcrypt.hash(password, salt)
  return passwordHash
}

export async function comparePassword(password, hashPassword) {
  return await bcrypt.compare(password, hashPassword)
}

export async function issueAccessToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: 60 * 60 * 1 * 24 *  7 }) // 7 days validity
}

export async function createRefreshToken(userId) {
  let expiryDate = new Date()
  expiryDate.setSeconds(60 * 60 * 24) //24 hours validity
  const token = uuidv4()
  const refreshToken = await RefreshTokenModel.create({
    token,
    user: userId,
    expiryDate: expiryDate.getTime(),
  })
  return refreshToken.token
}

export async function verifyRefreshTokenExpiration(token) {
  return token.expiryDate.getTime() < new Date().getTime()
}

