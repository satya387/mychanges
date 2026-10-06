import { environment } from 'src/environments/environment';

const BASE_URL = environment.apiBaseUrl;

export const ROLE_URLS = {
  ROLES_LIST: BASE_URL + 'Role/Get',
  CREATE_ROLE: BASE_URL + 'Role/Create',
  EDIT_ROLE: BASE_URL + 'Role/Update?roleId=',
  DELETE_ROLE: BASE_URL + 'Role/Delete',
  GET_USER_ROLES_LIST: BASE_URL + 'Role/GetUserRolesById?userId=',
  GET_ROLES_WITHOUT_PAGINATION: BASE_URL + 'Role/GetCustomRoleData',
}
