import { environment } from 'src/environments/environment';
const BASE_URL = environment.apiBaseUrl;

export const Ray_URLS = {
  GET_ALL_Job_DETAILS: BASE_URL + 'Ray/GetJobs',
  GET_Job_DETAILS: BASE_URL + 'Ray/GetJobDetails?jobId='
};
