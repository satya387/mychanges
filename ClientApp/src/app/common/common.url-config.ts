import { environment } from 'src/environments/environment';

const BASE_URL = environment.apiBaseUrl;

export const AUTH_TOKEN_URLS = {
  GET_CUSTOM_TOKEN: BASE_URL + 'Auth/GenerateToken',
  GET_IMAGE_URL: BASE_URL + 'General/GetImageUrl',
  GET_PROFILE: BASE_URL + 'General/GetIntegrationDetails?tileCode=',
}
