/*
 * Copyright (C) 2024 MoodMotion.io - All Rights Reserved
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
import catchAsync from '../errors/catchAsync'
import { userService } from '../services'
import { Request, Response } from 'express'
import { Types } from 'mongoose'
import ApiError from '../errors/ApiError'

/**
 * 
 */
const createUser = catchAsync(async (request: Request, response: Response) => {
  const user = await userService.createUser(request.body)
  response.status(httpStatus.CREATED).send(user)
})

/**
 * 
 */
const getUsers = catchAsync(async (request: Request, response: Response) => {
  response.send([{ status: 'not implemented' }])
})

/**
 * 
 */
const getUser = catchAsync(async (request: Request, response: Response) => {
  const id = new Types.ObjectId(request.params.userId)
  const user = await userService.getUserById(id)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }
  response.send(user)
})

/**
 * 
 */
const updateUser = catchAsync(async (request: Request, response: Response) => {
  const id = new Types.ObjectId(request.params.userId)
  const user = await userService.updateUserById(id, request.body)
  response.send(user)
})

/**
 * 
 */
const deleteUser = catchAsync(async (request: Request, response: Response) => {
  const id = new Types.ObjectId(request.params.userId)
  await userService.deleteUserById(id)
  response.status(httpStatus.NO_CONTENT).send()
})

export {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
}
