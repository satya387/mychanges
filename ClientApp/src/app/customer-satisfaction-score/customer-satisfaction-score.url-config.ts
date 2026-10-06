import { environment } from 'src/environments/environment';

const BASE_URL = environment.apiBaseUrl;

export const CSAT_SCORE_URLS = {
    GetAccounts: BASE_URL + 'CSAT/GetAccountBasedOnEmpId?empEmidsId=',
    GetProjects: BASE_URL +'CSAT/GetprojectsBasedOnEmpId/',
    GetCustomers_LIST: BASE_URL + 'CustomerValueAdd/GetCustomerValueAddDetails/',
    GetEmployees: BASE_URL +'CustomerValueAdd/GetEmployeeDetails/',
    GetRoleType:BASE_URL +'CustomerValueAdd/GetEmployeeRole?EmpEmidsId=',
    GetTemplateDetails: (employeeId, cycle) => `${BASE_URL}CSAT/GetCSATTemplateDeatils?employeeId=${employeeId}&cycle=${cycle}`,
    GetBuList: BASE_URL + 'CSAT/GetBUListByEmpId?empEmidsId=',
    UploadCSATDocument: BASE_URL + 'CSAT/Upload',
    GetCSATCycles : BASE_URL + 'CSAT/GetCSATCycles',
    GetCSATUploadData : BASE_URL + 'CSAT/GetCSATUploadData?',
    ClientRespondentData: BASE_URL + 'CSAT/ClientRespondentDetails',
    GetRespondentDetails: BASE_URL + 'CSAT/GetRespondentDetails?',
    EditDetails:BASE_URL + 'CSAT/GetEditDetails?Id=',
    DELETE_CSAT: BASE_URL + 'CSAT/Delete',
    DropDownValues:BASE_URL+'CSAT/GetManagementLevels'

}
