/* eslint-disable */
import { inject, InjectionKey } from 'vue';
import { Emitter } from 'mitt';

export type Events = {
  signIn: any;
};
export const EmitterKey: InjectionKey<Emitter<Events>> = Symbol('Emitter');

export function useEmitter(): Emitter<Events> {
  const emitter = inject(EmitterKey);
  if (!emitter) {
    throw new Error(`${EmitterKey} is not provided`);
  }
  return emitter;
}
