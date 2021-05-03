import { createStore } from 'vuex';
import request from "./modules/request";
import theme from "./modules/theme";

export default createStore({
  modules: {
    request,
    theme
  },
});
