//

import { environment } from 'src/environments/environment';

const BASE_URL = environment.apiBaseUrl;

export const CONTENT_URLS = {
  GET_CONTENT_LIST: BASE_URL + 'Contents/ContentGridData',
  CREATE_CONTENT: BASE_URL + 'Contents/Create',
  UPDATE_CONTENT: BASE_URL + 'Contents/Update',
  UPDATE_CONTENT_STATUS: BASE_URL + 'Contents/UpdateContentStatus',
  DELETE_CONTENT: BASE_URL + 'Contents/Delete',
  GET_CONTENT_DATA: BASE_URL + 'Contents?ContentId=',
  GET_BANNER_IMAGES: BASE_URL + 'Contents/GetBannerImages',
  GET_CACHED_DATA: BASE_URL + 'Contents/GetDataFromCache?key=',
  REMOVE_CACHED_DATA: BASE_URL + 'Contents/RemoveDataFromCache?key=',
  check_CodeOfConduct_Acceptance: BASE_URL + 'Contents/checkCodeOfConductAcceptance',
  Accept_codeOfConduct_: BASE_URL + 'Contents/AcceptcodeOfConduct'
}
