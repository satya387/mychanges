// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // Emids
  // clientId: "79998564-fd2a-43c8-9bdc-576dd8545e80", //"85e00764-f078-4c13-a7f9-60e4846c43c6", //ClientId of Web App
  // resourceScope: "api://79998564-fd2a-43c8-9bdc-576dd8545e80/access_as_user",//"https://emidslab.onmicrosoft.com/arcportalapi/access_as_user",
  // authority:  "https://login.microsoftonline.com/emids.onmicrosoft.com",//"https://login.microsoftonline.com/emidslab.onmicrosoft.com",
  // apiBaseUrl: 'https://erika-int.azurewebsites.net/',
  // redirectUri: "https://erika-int.azurewebsites.net/",
  // postLogoutRedirectUri: "https://erika-int.azurewebsites.net/logout",

// Emids, local debugging
  //clientId: "79998564-fd2a-43c8-9bdc-576dd8545e80", //"85e00764-f078-4c13-a7f9-60e4846c43c6", //ClientId of Web App
  //resourceScope: "api://79998564-fd2a-43c8-9bdc-576dd8545e80/access_as_user",//"https://emidslab.onmicrosoft.com/arcportalapi/access_as_user",
  //authority:  "https://login.microsoftonline.com/emids.onmicrosoft.com",//"https://login.microsoftonline.com/emidslab.onmicrosoft.com",
  //apiBaseUrl: 'https://localhost:44345/',
  //redirectUri: "https://localhost:44369/",
  //postLogoutRedirectUri: "https://localhost:44369/logout",

  // Kalpita
     //clientId: "79998564-fd2a-43c8-9bdc-576dd8545e80", //ClientId of Web App
     //resourceScope: "api://79998564-fd2a-43c8-9bdc-576dd8545e80/access_as_user",
     clientId: "1d121663-db44-4ec0-b85f-98f0e7ca1f1d", //ClientId of Web App
    resourceScope: "api://1d121663-db44-4ec0-b85f-98f0e7ca1f1d/access_as_user",
    authority: "https://login.microsoftonline.com/emids.onmicrosoft.com",
  apiBaseUrl: 'https://localhost:44345/',
  redirectUri: "https://localhost:44369/",
  postLogoutRedirectUri: "https://localhost:44369/logout",
  sharepointBaseUrl: " https://arc-test.emids.com/Search/Websearchnew/",
  arcBaseUrl: "https://arc-staging.emids.com"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *https://localhost:44369/
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
