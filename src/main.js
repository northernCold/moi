import { createApp } from 'vue';
import VTooltip from 'v-tooltip'
import 'v-tooltip/dist/v-tooltip.css'
import App from './App';
import router from './router';
import store from './store';
import icons from './icons';
import "tailwindcss/tailwind.css"
import "./assets/styles/index.scss";

const app = createApp(App);
app.config.productionTip = false;

app

  .use(icons)
  .use(VTooltip)
  .use(store)
  .use(router)
  .mount('#app');