import ui from '../common/ui';
import Vue from 'vue';
import App from './App/App.vue';
import { Button, Container, Header, Input, Main, Notification, Radio } from 'element-ui';

Vue.use(Button);
Vue.use(Container);
Vue.use(Header);
Vue.use(Main);
Vue.use(Input);
Vue.use(Radio);
Vue.prototype.$ui = ui;
Vue.prototype.$notify = Notification;
Vue.config.productionTip = false;

document.title = ui.get('optionsTitle');

new Vue({
  el: '#options-app',
  commonents: {
    App,
  },
  render(h) {
    return h(App);
  },
});
