import SvgIcon from '@/components/svg-icon'// svg component

const req = require.context('./svg', false, /\.svg$/);
const requireAll = function (requireContext) {
  requireContext.keys().map(requireContext);
}
requireAll(req);


export default {
  install: (app) => {
    app.component("svg-icon", SvgIcon)
  }
};