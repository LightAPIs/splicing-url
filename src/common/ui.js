'use strict';
import { v4 } from 'uuid';

const ui = {
  get(...arg) {
    return chrome.i18n.getMessage(...arg);
  },
  uuid() {
    return v4();
  },
};

export default ui;
