import { createStore } from 'vuex';
import request from "./modules/request";
import theme from "./modules/theme";
import postwoman from "./modules/postwoman"

export default createStore({
  modules: {
    request,
    theme,
    postwoman
  },
});
