import { reactive, inject, InjectionKey, readonly } from 'vue';

type AuthState = {
  signedIn: boolean;
  username: string;
};

// eslint-disable-next-line
const authStore = () => {
  const state = reactive<AuthState>({
    signedIn: false,
    username: '',
  });

  const setSignedIn = (value: boolean) => {
    state.signedIn = value;
  };

  const setUsername = (value: string) => {
    state.username = value;
  };

  return {
    authState: readonly(state),
    setSignedIn,
    setUsername,
  };
};

export default authStore;
export type AuthStore = ReturnType<typeof authStore>;
export const AuthStoreKey: InjectionKey<AuthStore> = Symbol('AuthStore');

export function useAuthStore(): AuthStore {
  const store = inject(AuthStoreKey);
  if (!store) {
    throw new Error(`${AuthStoreKey} is not provided`);
  }
  return store;
}
