'use strict';
import { v4 } from 'uuid';

const ui = {
  getMessage(key) {
    if (process.env.VUE_APP_MANIFEST === 'v3') {
      const message =
        navigator.language === 'zh-CN'
          ? {
              contextPage: '在网页上添加右键菜单',
              optionsConfig: '配置',
            }
          : {
              contextPage: 'Add context menu to page',
              optionsConfig: 'Config',
            };

      return message[key];
    } else {
      return chrome.i18n.getMessage(key);
    }
  },
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
