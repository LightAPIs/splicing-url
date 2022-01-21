'use strict';
import { v4 } from 'uuid';

const ui = {
  get(...arg) {
    return chrome.i18n.getMessage(...arg);
  },
  uuid() {
    return v4();
  },
  pageContextMenu(id, title, status = false) {
    if (status) {
      chrome.contextMenus.create({
        id,
        type: 'normal',
        title,
        contexts: ['page'],
        documentUrlPatterns: ['http://*/*', 'https://*/*', 'file://*/*'],
      });
    } else {
      chrome.contextMenus.remove(id);
    }
  },
  updateContextMenu(id, newTitle) {
    chrome.contextMenus.update(id, {
      title: newTitle,
    });
  },
};

export default ui;
