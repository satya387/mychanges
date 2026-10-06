
import { environment } from "../../../environments/environment";



const BASE_URL = environment.apiBaseUrl;
const SHAREPOINT_BASE_URL = environment.sharepointBaseUrl;
export const SEARCH_URLS = {
  GET_SEARCH_LIST: BASE_URL + 'General/WebSearch/',
  GET_SHAREPOINT_BASE_URL: SHAREPOINT_BASE_URL
}
