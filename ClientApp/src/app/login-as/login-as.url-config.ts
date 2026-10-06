import { environment } from 'src/environments/environment';

const BASE_URL = environment.apiBaseUrl;
const ARC_BASE_URL = environment.arcBaseUrl;

export const LOGIN_AS_URLS = {
  HOME_SECTION_LIST: BASE_URL + 'Modules/GetModulesByEmployeeId?empEmidsId=',  
  get_NAME : BASE_URL + 'Modules/GetEmployeeName?employeeName=',
  get_EmpId : BASE_URL + 'Modules/GetEmployeeId?employeeName=',
  SAVE_LOGIN_DETAILS: BASE_URL + 'Modules/SaveUserDetails'
}
