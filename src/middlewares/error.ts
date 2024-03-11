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
import mongoose from 'mongoose'
import httpStatus from 'http-status'
import config from '../config/config'
import logger from '../config/logger'
import ApiError from '../errors/ApiError'
import { NextFunction, Request, Response } from 'express'

const errorConverter = (error: Error, request: Request, response: Response, next: NextFunction) => {

  if (!(error instanceof ApiError)) {
    const statusCode = error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR
    const message = error.message || httpStatus[statusCode]
    error = new ApiError(statusCode, message, false, error.stack)
  }

  next(error)
}

// eslint-disable-next-line no-unused-vars
const errorHandler = (error: ApiError, request: Request, response: Response, next: NextFunction) => {

  let { statusCode, message } = error
  if (config.env === 'production' && !error.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR]
  }

  response.locals.errorMessage = error.message

  const responseMessage = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: error.stack }),
  };

  if (config.env === 'development') {
    logger.error(error)
  }

  response.status(statusCode).send(responseMessage)
}

export {
  errorConverter,
  errorHandler,
}
