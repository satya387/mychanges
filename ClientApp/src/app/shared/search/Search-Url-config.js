"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SEARCH_URLS = void 0;
var environment_1 = require("../../../environments/environment");
var BASE_URL = environment_1.environment.apiBaseUrl;
var SHAREPOINT_BASE_URL = environment_1.environment.sharepointBaseUrl;
exports.SEARCH_URLS = {
    GET_SEARCH_LIST: BASE_URL + 'General/WebSearch/',
    GET_SHAREPOINT_BASE_URL: SHAREPOINT_BASE_URL
};
//# sourceMappingURL=Search-Url-config.js.map