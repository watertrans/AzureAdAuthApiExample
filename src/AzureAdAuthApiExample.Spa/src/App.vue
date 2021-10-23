<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, MsalKey, GraphRequestScopes } from '@/modules/authConfig';
import { useAuthStore } from '@/modules/authStore';
import { useEmitter } from '@/modules/events';
import AuthService from '@/services/authService';

export default defineComponent({
  name: 'App',
  setup() {
    const msal = new PublicClientApplication(msalConfig);
    const authStore = useAuthStore();
    const emitter = useEmitter();
    const authService = new AuthService(msal, authStore, emitter);

    authService.init();
    authService.acquireToken(GraphRequestScopes);

    provide(MsalKey, msal);
  },
});
</script>
