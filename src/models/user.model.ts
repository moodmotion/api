/*
 * Copyright (C) 2024 Bikeletics.com - All Rights Reserved
 *
 *   ----------------------------
 *    Proprietary and confidential
 *   ----------------------------
 *
 * This file is part of the Bikeletics Ride application
 *
 * Unauthorized copying of this file, via any medium is 
 * strictly prohibited.
 */
import { Document, Schema, model, ObjectId, Model, Types } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import toJSON from './plugins/toJSON.plugin'

/**
 * Interface describing and typing the User Document
 */
export interface UserDocument extends Document {
  name: string
  email: string
  password: string
  role: string
  isEmailVerified: boolean
}

interface UserMethods {
  isPasswordMatch(password: string): Promise<boolean>
}

export interface UserModel extends Model<UserDocument, {}, UserMethods> {
  isEmailTaken(email: string, excludeUserId?: Types.ObjectId): Promise<boolean>
}

const schema = new Schema<UserDocument, UserModel, UserMethods>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

/**
 * Check if email is taken
 * 
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
schema.static('isEmailTaken', async function (email: string, excludeUserId?: ObjectId) {
  const user: UserDocument | null = await this.findOne({ email, _id: { $ne: excludeUserId } })
  return !!user
})

/**
 * Check if password matches the user's password
 * 
 * @param {string} password
 * @returns {Promise<boolean>}
 */
schema.method('isPasswordMatch', async function (password: string): Promise<boolean> {
  const user = this
  return bcrypt.compare(password, user.password)
})

// add plugin that converts mongoose to json
// @todo add pagination?
//userSchema.plugin(paginate);
schema.plugin(toJSON)

schema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

const User = model<UserDocument, UserModel>('User', schema)

export default User
