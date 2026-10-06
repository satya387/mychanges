import { environment } from "../../../environments/environment";



const BASE_URL = environment.apiBaseUrl;

export const ALERT_URLS = {
  GET_ALERT_LIST: BASE_URL + 'General/GetAlerts?ManagerId=',
  Get_List: BASE_URL + 'General/GetAlert?empId='

}
