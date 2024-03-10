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
