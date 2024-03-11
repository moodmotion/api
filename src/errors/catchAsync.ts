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
import { NextFunction, Request, Response } from "express"

const catchAsync = (fn: Function) => (request: Request, response: Response, next: NextFunction) => {
  Promise.resolve(fn(request, response, next)).catch((err) => next(err))
};

export default catchAsync
