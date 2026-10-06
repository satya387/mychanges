import { environment } from 'src/environments/environment';

const BASE_URL = environment.apiBaseUrl;

export const CVA_URLS = {
  GetCustomers_LIST: BASE_URL + 'CustomerValueAdd/GetCustomerValueAddDetails/',
         GetAccounts: BASE_URL + 'CustomerValueAdd/GetAccountBasedOnEmpId?empEmidsId=',
         GetProjects: BASE_URL +'CustomerValueAdd/GetprojectsBasedOnEmpId/',
         GetEmployees: BASE_URL +'CustomerValueAdd/GetEmployeeDetails/',
         CREATE_CVA: BASE_URL + 'CustomerValueAdd/CreateCustomerValueAdd/',
         EditDetails:BASE_URL + 'CustomerValueAdd/GetEditDetails?Id=',
         UPDATE_CVA:BASE_URL + 'CustomerValueAdd/updateCVADetails/',
         GetStudioDetails:BASE_URL + 'CustomerValueAdd/GetStudioDetails/',
         GetRoleType:BASE_URL +'CustomerValueAdd/GetEmployeeRole?EmpEmidsId=',
         GetStatusDetails:BASE_URL + 'CustomerValueAdd/GetStatusDetails/',
         GetAllCategories:BASE_URL + 'CustomerValueAdd/GetAllCategories/',
         GetAllServiceArea:BASE_URL + 'CustomerValueAdd/GetAllServiceArea/',
}
