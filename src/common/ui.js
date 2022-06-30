'use strict';
import { v4 } from 'uuid';

const parentId = 'SPLICING_URL_PARENT';
const contexts = ['page'];

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
  createAllContextMenu(list) {
    //? create parent menu
    chrome.contextMenus.create({
      id: parentId,
      type: 'normal',
      title: 'Splicing URL',
      contexts,
    });

    if (list.length > 0) {
      list.forEach((item, index) => {
        this.pageContextMenu(item.id, item.name || this.getMessage('optionsConfig') + ' ' + (index + 1).toString(), true);
      });
    }
  },
  removeAllContextMenu(list) {
    if (list.length > 0) {
      list.forEach(item => {
        this.pageContextMenu(item.id, '', false);
      });
    }
    chrome.contextMenus.remove(parentId);
  },
  pageContextMenu(id, title, status = false) {
    if (status) {
      chrome.contextMenus.create({
        id,
        type: 'normal',
        title,
        contexts,
        parentId,
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
