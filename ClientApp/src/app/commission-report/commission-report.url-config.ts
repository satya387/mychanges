import {environment} from 'src/environments/environment';

const BASE_URL = environment.apiBaseUrl;
const CONTROLLER_NAME = 'CommissionReport';

export const CR_URLS = {
    GET_ALL_CP_COMMISSION_DATA : BASE_URL + CONTROLLER_NAME + '/GetAllCPCommissionData',
    GET_COMMISSION_REPORT_BY_CLIENTID : BASE_URL + CONTROLLER_NAME + '/GetCPCommissionByClientId',
    GET_COMMISSION_REPORT_BY_Id : BASE_URL + CONTROLLER_NAME + '/GetCPCommissionById',
    UPDATE_INCENTIVE_EARNED_BY_Id : BASE_URL + CONTROLLER_NAME + '/UpdateIncentiveEarnedById',
    GET_COMMISSION_REPORT_DRILL_DOWN_DATA : BASE_URL + CONTROLLER_NAME + '/GetCommissionReportDrillDownByClientId',
    CHECK_IS_ADMIN : BASE_URL + CONTROLLER_NAME + '/CheckIsAdminByEmpemidsId',
    GET_COMMISSION_REPORT_GRID : BASE_URL + CONTROLLER_NAME + '/GetCommissionReportGrid'
}