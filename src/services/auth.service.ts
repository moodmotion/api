/*
 * Copyright (C) 2024  MoodMotion.io - All Rights Reserved
 *
 *   ----------------------------
 *    Proprietary and confidential
 *   ----------------------------
 *
 * This file is part of the MoodMotion API
 *
 * Unauthorized copying of this file, via any medium is 
 * strictly prohibited.
 */
import httpStatus from 'http-status'
import Token from '../models/token.model'
import ApiError from '../errors/ApiError'
import { tokenTypes } from '../config/tokens'
import { updateUserById, getUserById, getUserByEmail } from './user.service'
import { generateAuthTokens, verifyToken } from './token.service'
import { UserDocument } from '../models/user.model'

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<UserDocument>}
 */
const loginUserWithEmailAndPassword = async (email: string, password: string): Promise<UserDocument> => {

  const user = await getUserByEmail(email)

  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password')
  }

  return user
}

/**
 * Logout
 * @param {string} refreshToken
 */
const logout = async (refreshToken: string) => {

  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false })

  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found')
  }

  return await Token.findByIdAndDelete(refreshTokenDoc.id)
}

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken: string): Promise<object> => {
  try {

    const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH)
    const user = await getUserById(refreshTokenDoc.user)

    if (!user) {
      throw new Error()
    }

    await Token.findByIdAndDelete(refreshTokenDoc.id)
    return generateAuthTokens(user)

  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate')
  }
}

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken: string, newPassword: string): Promise<any> => {
  try {
    const resetPasswordTokenDoc = await verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD)
    const user = await getUserById(resetPasswordTokenDoc.user)
    if (!user) {
      throw new Error()
    }
    await updateUserById(user.id, { password: newPassword })
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD })
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed')
  }
}

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken: string): Promise<any> => {
  try {
    const verifyEmailTokenDoc = await verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL)
    const user = await getUserById(verifyEmailTokenDoc.user)
    if (!user) {
      throw new Error()
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL })
    await updateUserById(user.id, { isEmailVerified: true })
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed')
  }
};

export { loginUserWithEmailAndPassword, logout, refreshAuth, resetPassword, verifyEmail }
