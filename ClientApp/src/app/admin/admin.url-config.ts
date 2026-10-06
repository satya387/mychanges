import { environment } from 'src/environments/environment';

const BASE_URL = environment.apiBaseUrl;

export const ADMIN_URLS = {
  ROLES_LIST: BASE_URL + 'roles/get',
  TILES_LIST: BASE_URL + 'tiles/get',
  MODULES_LIST: BASE_URL + 'modules/get',
  USERS_LIST: BASE_URL + 'users/get'
}
