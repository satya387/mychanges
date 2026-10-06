import { environment } from 'src/environments/environment';

const BASE_URL = environment.apiBaseUrl;

export const PAYROLL_JOURNAL_URLS = {
  UPLOAD_PAYROLL_JOURNAL: BASE_URL + 'PayrollJournal/Upload',
  GET_PAYROLL_JOURNAL_REPORT_DATA: BASE_URL + 'PayrollJournal/GetPayrollJournalReportData',
  GET_PAYROLL_JOURNAL_GRID_DATA: BASE_URL + 'PayrollJournal/GetPayrollJournalGridData',
}
