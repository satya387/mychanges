import {environment} from 'src/environments/environment';

const BASE_URL = environment.apiBaseUrl;
const CONTROLLER_NAME = 'ProcurementProcess';

export const PR_URLS = {
    GET_ALL_PR_DETAILS : BASE_URL + CONTROLLER_NAME + '/GetAllPRDetails',
    GET_PR_DETAILS_BY_ID : BASE_URL + CONTROLLER_NAME + '/GetPRDetailsById', 
    GET_PROJECT_BY_EMPEMIDSID : BASE_URL + CONTROLLER_NAME + '/GetProjectByEmpId?empEmidsId=', 
    GET_REQUISITION_TYPE : BASE_URL + CONTROLLER_NAME + '/GetRequisitionType',
    GET_CURRENCY_TYPE : BASE_URL + CONTROLLER_NAME + '/GetCurrencyType',
    GET_ACCOUNT_NAME_BY_PROJECT_ID : BASE_URL + CONTROLLER_NAME + '/GetAccountByProjectId?projectId=',
    GET_DH_BY_PROJECT_ID : BASE_URL + CONTROLLER_NAME + '/GetDHByProjectId?projectId=',
    GET_CITIES_BY_LOCATION_ID : BASE_URL + CONTROLLER_NAME + '/GetCitiesByLocationId?locationId=',
    GET_PR_STATUS : BASE_URL + CONTROLLER_NAME + '/GetPRStatus',
    GET_PR_LOCATION : BASE_URL + CONTROLLER_NAME + '/GetPRLocation', 
    SAVE_PR_DETAILS : BASE_URL + CONTROLLER_NAME + '/CreatePurchaseRequest', 
    UPDATE_PR_STATUS : BASE_URL + CONTROLLER_NAME + '/UpdatePurchaseRequestStatus', 
    REJECT_PR_STATUS : BASE_URL + CONTROLLER_NAME + '/RejectPurchaseRequest' ,
    TRIGGER_MAIL : BASE_URL + CONTROLLER_NAME + '/TriggerEmail?id=' ,
    GET_PR_EXCEL_DUMP: BASE_URL + CONTROLLER_NAME + '/GetPRExcelDumpReport',
    Download_Doc: BASE_URL +  CONTROLLER_NAME +'/Download_Doc', 
    PR_Details:BASE_URL + 'ProcurementProcess/GetPRDetails?Id=',
    POEditDetails:BASE_URL + 'ProcurementProcess/GetPOEditDetails?Id=',
    GetBuyersByLocationId: BASE_URL + 'ProcurementProcess/GetBuyersByLocationId?locationId='
}
