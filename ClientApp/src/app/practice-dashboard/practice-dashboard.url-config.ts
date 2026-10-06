import {environment} from 'src/environments/environment';

const BASE_URL = environment.apiBaseUrl;
const CONTROLLER_NAME = 'PracticeDashboard';

export const Practice_URL = {
    GET_PRACTICE_ALL_ACCOUNTS_BY_EMP_ID : BASE_URL + CONTROLLER_NAME +'/GetAllAccountsByEmployeeId',
    GET_PRACTICE_ALL_PRACTICES_BY_EMP_ID : BASE_URL + CONTROLLER_NAME +'/GetAllPracticesByEmployeeId',
    GET_PRACTICE_DASHBOARD_OVERALL_DATA : BASE_URL + CONTROLLER_NAME+ '/GetOverAllPracticeDashboardData',
    GET_PRACTICE_DASHBOARD_DATA_BY_PRACTICE_ID : BASE_URL + CONTROLLER_NAME+ '/GetPracticeDashboardDataByPractice',
    }