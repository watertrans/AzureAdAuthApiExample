import { inject, InjectionKey } from 'vue';
import { AxiosStatic } from 'axios';

export const AxiosKey: InjectionKey<AxiosStatic> = Symbol('AxiosStatic');

export function useAxios(): AxiosStatic {
  const axios = inject(AxiosKey);
  if (!axios) {
    throw new Error(`${AxiosKey} is not provided`);
  }
  return axios;
}
