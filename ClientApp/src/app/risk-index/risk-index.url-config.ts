import { environment } from 'src/environments/environment';

const BASE_URL = environment.apiBaseUrl;

export const RI_URLS = {
  PROJECT_RISK_INDEX_DETAILS: BASE_URL + 'RiskIndexing/get-project-riskindex-details',
  ADD_RISK_INDEX_DETAILS: BASE_URL + 'RiskIndexing/submit-project-riskindex-details'
}
