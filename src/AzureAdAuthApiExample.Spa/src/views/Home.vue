<template>
  <div class="home">
    <div v-if="username">username: {{ username }}</div>
    <button id="signIn" v-if="!signedIn" @click="onClickSignIn">Sign In</button>
    <button id="signOut" v-if="signedIn" @click="onClickSignOut">Sign Out</button>
    <button id="weatherForecast" v-if="signedIn" @click="onClickWeatherForecast">Weather Forecast</button>
    <button id="users" v-if="signedIn" @click="onClickUsers">Users</button>
    <div v-for="forecast in forecasts" :key="forecast.date">
      <div>date: {{ forecast.date }}</div>
      <div>temperatureC: {{ forecast.temperatureC }}</div>
      <div>temperatureF: {{ forecast.temperatureF }}</div>
      <div>summary: {{ forecast.summary }}</div>
    </div>
    <div v-for="user in users" :key="user.displayName">
      <div>businessPhones: {{ user.businessPhones }}</div>
      <div>displayName: {{ user.displayName }}</div>
      <div>givenName: {{ user.givenName }}</div>
      <div>id: {{ user.id }}</div>
      <div>jobTitle: {{ user.jobTitle }}</div>
      <div>mail: {{ user.mail }}</div>
      <div>mobilePhone: {{ user.mobilePhone }}</div>
      <div>officeLocation: {{ user.officeLocation }}</div>
      <div>preferredLanguage: {{ user.preferredLanguage }}</div>
      <div>surname: {{ user.surname }}</div>
      <div>userPrincipalName: {{ user.userPrincipalName }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { useMsal, ExampleRequestScopes, GraphRequestScopes } from '@/modules/authConfig';
import { useAuthStore } from '@/modules/authStore';
import { useAxios } from '@/modules/axios';
import { useEmitter } from '@/modules/events';
import { WeatherForecast, User, ArrayValue } from '@/models';
import AuthService from '@/services/authService';

export default defineComponent({
  name: 'Home',
  setup() {
    const msal = useMsal();
    const authStore = useAuthStore();
    const axios = useAxios();
    const emitter = useEmitter();
    const authService = new AuthService(msal, authStore, emitter);
    const state = reactive({
      signedIn: authStore.authState.signedIn,
      username: authStore.authState.username,
      forecasts: [] as WeatherForecast[],
      users: [] as User[],
    });
    const onClickSignIn = () => {
      msal.loginRedirect({ scopes: GraphRequestScopes });
    };

    const onClickSignOut = () => {
      msal.logoutRedirect();
    };

    const onClickWeatherForecast = async () => {
      authService.acquireToken(ExampleRequestScopes).then((response) => {
        const config = authService.getRequestConfig(response?.accessToken);
        axios.get((process.env.VUE_APP_API_BASE_URI as string) + 'WeatherForecast', config).then((response) => {
          state.forecasts = response.data as WeatherForecast[];
        });
      });
    };

    const onClickUsers = async () => {
      authService.acquireToken(GraphRequestScopes).then((response) => {
        const config = authService.getRequestConfig(response?.accessToken);
        axios.get((process.env.VUE_APP_GRAPH_API_BASE_URI as string) + 'users', config).then((response) => {
          state.users = (response.data as ArrayValue<User>).value;
        });
      });
    };

    emitter.on('signIn', () => {
      state.signedIn = authStore.authState.signedIn;
      state.username = authStore.authState.username;
    });

    return {
      ...toRefs(state),
      onClickSignIn,
      onClickSignOut,
      onClickWeatherForecast,
      onClickUsers,
    };
  },
});
</script>
