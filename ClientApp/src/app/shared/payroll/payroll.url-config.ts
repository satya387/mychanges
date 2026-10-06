import { environment } from 'src/environments/environment';

const BASE_URL = environment.apiBaseUrl;

export const PAYROLL_URLS = {
  GET_PAYROLL_AUTH_KEY: BASE_URL + 'Payroll/GetPayrollAuthKey',
}
