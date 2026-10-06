import {environment} from 'src/environments/environment';

const BASE_URL = environment.apiBaseUrl;
const CONTROLLER_NAME = 'SegmentDashboard';

export const Segment_URL = {
    GET_SEGMENT_ALL_ACCOUNTS_BY_EMP_ID : BASE_URL + CONTROLLER_NAME +'/GetAllAccountsByEmployeeId',
    GET_SEGMENT_ALL_SEGMENTS_BY_EMP_ID : BASE_URL + CONTROLLER_NAME +'/GetAllSegmentsByEmployeeId',
    GET_SEGMENT_DASHBOARD_OVERALL_DATA : BASE_URL + CONTROLLER_NAME+ '/GetOverAllSegmentDashboardData',
    GET_SEGMENT_DASHBOARD_DATA_BY_SEGMENT_ID : BASE_URL + CONTROLLER_NAME+ '/GetSegmentDashboardDataBySegment',
    }