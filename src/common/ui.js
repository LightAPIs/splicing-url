'use strict';

const ui = {
  get(...arg) {
    return chrome.i18n.getMessage(...arg);
  },
};

export default ui;
