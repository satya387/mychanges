import { environment } from 'src/environments/environment';

const BASE_URL = environment.apiBaseUrl;

export const USERS_URLS = {
  USERS_LIST: BASE_URL + 'User/GetAllUser',
  USERS_GRID: BASE_URL + 'User/UserGridData',
  ASSIGN_ROLES_USER: BASE_URL + 'User/AssignRoles',
  ASSIGN_SECTIONS_USER: BASE_URL + 'User/AssignSections',
  ASSIGN_TILES_USER: BASE_URL + 'User/AssignTiles',
}
