import { Emitter } from 'mitt';
import { Events } from '@/modules/events';
import { AuthStore } from '@/modules/authStore';
import { AuthenticationResult, InteractionRequiredAuthError, PublicClientApplication } from '@azure/msal-browser';
import { AxiosRequestConfig } from 'axios';

export default class AuthService {
  private msal: PublicClientApplication;
  private authStore: AuthStore;
  private emitter: Emitter<Events>;
  constructor(msal: PublicClientApplication, authStore: AuthStore, emitter: Emitter<Events>) {
    this.msal = msal;
    this.authStore = authStore;
    this.emitter = emitter;
  }

  private emitSignIn(response: AuthenticationResult | null) {
    if (response && response.account) {
      this.authStore.setSignedIn(true);
      this.authStore.setUsername(response.account.username);
      this.emitter.emit('signIn');
    }
  }

  init(): void {
    this.msal
      .handleRedirectPromise()
      .then((response) => {
        this.emitSignIn(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getRequestConfig(accessToken: string | undefined): AxiosRequestConfig {
    return { headers: { Authorization: `Bearer ${accessToken}` } };
  }

  acquireToken(scopes: string[]): Promise<AuthenticationResult | null> {
    const accounts = this.msal.getAllAccounts();

    if (accounts.length >= 0) {
      const account = accounts[0];
      const silentRequest = {
        scopes: scopes,
        account: account,
        forceRefresh: false,
      };
      return this.msal
        .acquireTokenSilent(silentRequest)
        .then((response) => {
          if (!this.authStore.authState.signedIn) {
            this.emitSignIn(response);
          }
          return response;
        })
        .catch((error) => {
          if (error instanceof InteractionRequiredAuthError) {
            this.msal.acquireTokenRedirect(silentRequest);
          }
          return Promise.resolve(null);
        });
    }
    return Promise.reject(null);
  }
}
