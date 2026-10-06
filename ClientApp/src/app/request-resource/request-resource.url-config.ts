import { environment } from 'src/environments/environment';

const BASE_URL = environment.apiBaseUrl;

export const RR_URLS = {
  COUNTRY_LIST: BASE_URL + 'MasterData/GetAllCountries',
  TECHNOLOGY_LIST: BASE_URL + 'MasterData/GetAllTechnology',
  COE_LIST: BASE_URL + 'MasterData/GetAllCOE',
  JOB_TITLE_LIST: BASE_URL + 'MasterData/GetAllJobTitle',
  MIN_EXP_LIST: BASE_URL + 'MasterData/GetAllMinimumExperience',
  PROFICIENCY_LIST: BASE_URL + 'MasterData/GetAllProficiency',
  PROJECT_LIST: BASE_URL + 'MasterData/GetAllProjectName',
  REPORTING_MANAGER_LIST: BASE_URL + 'MasterData/GetAllReportingManager',
  REQUESTER_LIST: BASE_URL + 'MasterData/GetAllRequester',
  RESOURCE_REQUEST_GRID: BASE_URL + 'ResourceRequest/GridData',
  ROLES_LIST: BASE_URL + 'MasterData/GetAllRoles',
  ACCOUNT_NAME_LIST: BASE_URL + 'MasterData/GetAllAccountName',
  PREFERRED_SKILLS_LIST: BASE_URL + 'MasterData/GetAllPreferredSkills',
  WORK_LOCATION_LIST: BASE_URL + 'MasterData/GetWorkLocationOnCountry?country=',
  GET_RR_BY_ID: BASE_URL + 'ResourceRequest/Get?id=',
  CREATE_RR: BASE_URL + 'ResourceRequest/Create',
  GET_PROJECT_BY_ACCOUNT: BASE_URL + 'MasterData/GetAllProjectNameByAccount?accountId=',
}
