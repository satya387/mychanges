//

import { environment } from 'src/environments/environment';

const BASE_URL = environment.apiBaseUrl;

export const SECTION_URLS = {
  GET_ALL_MODULES: BASE_URL + 'Modules/GetModulesWithoutPagination',
  ROLES_BASED_SECTIONS: BASE_URL + 'Modules/GetModulesByRoleId?roleId=',
  GET_SECTION_LIST: BASE_URL + 'Modules/Get',
  CREATE_SECTIONS: BASE_URL + 'Modules/Create',
  UPDATE_SECTIONS: BASE_URL + 'Modules/Update',
  DELETE_SECTIONS: BASE_URL + 'Modules/Delete',
  DELETE_DEFAULT_SECTIONS: BASE_URL + 'Modules/DeleteDefaultModule',
  GET_USER_MODULES_TILES: BASE_URL + 'Modules/GetUserModulesTiles?userId=',
  ASSIGN_TILES_TO_SECTIONS: BASE_URL + 'Modules/AssignTilesToModule',
  GET_DEFAULT_SECTIONS: BASE_URL + 'Modules/GetDefaultModules',
  ADD_DEFAULT_SECTIONS: BASE_URL + 'Modules/updateDefaultModules',
  UPDATE_STATUS: BASE_URL + 'Modules/UpdateStatus',
  UPDATE_DEFAULT_STATUS: BASE_URL + 'Modules/UpdateDefaultStatus',
  HOME_SECTION_LIST: BASE_URL + 'Modules/GetModulesByUserId?userId=',
  GET_MODULE_BY_ID: BASE_URL + 'Modules/GetModulesByModuleId?moduleId=',
  HOME_UPDATE_ORDER: BASE_URL + 'Modules/UpdateDisplayOrder',
  PERSONALISE_SECTION: BASE_URL + 'Modules/PersonalizeModuleOrder',
}
