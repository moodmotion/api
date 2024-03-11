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
import Joi from 'joi'
import httpStatus from 'http-status'
import ApiError from '../errors/ApiError'
import { NextFunction, Request, Response } from 'express'

const pick = (object: any, keys: [string, string, string]): object => {
  return keys.reduce((obj: any, key: string) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key]
    }
    return obj
  }, {})
}

const validate = (schema: any) => (request: Request, response: Response, next: NextFunction) => {

  const validSchema = pick(schema, ['params', 'query', 'body'])
  // @ts-ignore
  const object = pick(request, Object.keys(validSchema))

  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object)

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ')
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage))
  }

  Object.assign(request, value)

  return next()
}

export default validate
