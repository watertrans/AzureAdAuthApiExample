import { inject, InjectionKey } from 'vue';
import { PublicClientApplication } from '@azure/msal-browser';

export const ExampleRequestScopes = ['api://' + (process.env.VUE_APP_CLIENT_ID as string) + '/Read'];
export const GraphRequestScopes = ['User.Read', 'User.ReadBasic.All', 'User.ReadWrite'];

export const msalConfig = {
  auth: {
    clientId: process.env.VUE_APP_CLIENT_ID as string,
    authority: 'https://login.microsoftonline.com/' + (process.env.VUE_APP_TENANT_ID as string),
    redirectUri: process.env.VUE_APP_REDIRECT_URI as string,
    postLogoutRedirectUri: process.env.VUE_APP_POST_LOGOUT_REDIRECT_URI as string,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

export const MsalKey: InjectionKey<PublicClientApplication> = Symbol('PublicClientApplication');

export function useMsal(): PublicClientApplication {
  const msal = inject(MsalKey);
  if (!msal) {
    throw new Error(`${MsalKey} is not provided`);
  }
  return msal;
}
