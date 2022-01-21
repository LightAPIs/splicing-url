import ui from '../common/ui';
import Vue from 'vue';
import App from './App/App.vue';
import { Button, Card, Container, Col, Header, Input, Main, MessageBox, Radio, RadioGroup, Row } from 'element-ui';

Vue.use(Button);
Vue.use(Card);
Vue.use(Col);
Vue.use(Container);
Vue.use(Header);
Vue.use(Main);
Vue.use(Input);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Row);
Vue.prototype.$ui = ui;
Vue.prototype.$msg = MessageBox;
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
