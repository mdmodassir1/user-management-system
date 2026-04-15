const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user'
};

const PERMISSIONS = {
  [ROLES.ADMIN]: [
    'create_user',
    'read_user',
    'update_user',
    'delete_user',
    'assign_role',
    'change_user_status',
    'read_all_users'
  ],
  [ROLES.MANAGER]: [
    'read_user',
    'update_user',
    'read_all_users'
  ],
  [ROLES.USER]: [
    'read_own_profile',
    'update_own_profile'
  ]
};

module.exports = { ROLES, PERMISSIONS };