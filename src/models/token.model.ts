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
import { Document, Model, Schema, SchemaTypes, Types, model } from 'mongoose'
import { tokenTypes } from '../config/tokens'
import toJSON from './plugins/toJSON.plugin'

export interface TokenDocument extends Document {
  token: string
  user: Types.ObjectId
  type: string
  expires: Date
  blacklisted: boolean
}

export interface TokenModel extends Model<TokenDocument> { }

const tokenSchema = new Schema<TokenDocument, TokenModel>(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON)

const Token = model<TokenDocument, TokenModel>('Token', tokenSchema)

export default Token
