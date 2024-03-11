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
const allRoles = {
  user: [],
  admin: ['getUsers', 'manageUsers'],
}

const roles = Object.keys(allRoles)
const roleRights = new Map(Object.entries(allRoles))

export {
  roles,
  roleRights
}
