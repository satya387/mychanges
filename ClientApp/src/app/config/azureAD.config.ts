
import { IPublicClientApplication, PublicClientApplication, InteractionType, BrowserCacheLocation, LogLevel } from '@azure/msal-browser';
import { MsalInterceptorConfiguration, MsalGuardConfiguration } from '@azure/msal-angular';
import { environment } from 'src/environments/environment';

const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1; // Remove this line to use Angular Universal

export function loggerCallback(logLevel: LogLevel, message: string) {
  // console.log(message);
}

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      // clientId: '6226576d-37e9-49eb-b201-ec1eeb0029b6', // Prod enviroment. Uncomment to use.
      clientId: environment.clientId, // PPE testing environment
      // authority: 'https://login.microsoftonline.com/common', // Prod environment. Uncomment to use.
      authority: environment.authority,
      redirectUri: environment.redirectUri,
      postLogoutRedirectUri: environment.postLogoutRedirectUri
    },
    cache: {
      cacheLocation: BrowserCacheLocation.SessionStorage,
      storeAuthStateInCookie: isIE, // set to true for IE 11. Remove this line to use Angular Universal
    },
    system: {
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false
      }
    }
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  // protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read']); // Prod environment. Uncomment to use.
  protectedResourceMap.set(environment.apiBaseUrl, [environment.resourceScope]);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: [environment.resourceScope]
    },
    loginFailedRoute: '/login-failed'
  };
}
