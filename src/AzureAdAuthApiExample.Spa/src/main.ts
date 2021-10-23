import { createApp } from 'vue';
import authStore, { AuthStoreKey } from '@/modules/authStore';
import { EmitterKey, Events } from '@/modules/events';
import { AxiosKey } from '@/modules/axios';
import App from '@/App.vue';
import router from '@/router';
import axios from 'axios';
import mitt, { Emitter } from 'mitt';

const emitter: Emitter<Events> = mitt<Events>();
const app = createApp(App);

app.provide(AuthStoreKey, authStore());
app.provide(EmitterKey, emitter);
app.provide(AxiosKey, axios);

app.use(router);

app.mount('#app');
