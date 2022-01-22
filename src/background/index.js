'use strict';

import ui from '../common/ui';
import operation from '../common/operation';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['page', 'groups'], res => {
    const { page, groups = [] } = res;
    const contexts = [];
    if (process.env.VUE_APP_MANIFEST === 'v3') {
      contexts.push('action');
    } else {
      contexts.push('browser_action');
    }

    chrome.contextMenus.create({
      id: 'contextPage',
      type: 'checkbox',
      checked: page === true,
      title: ui.getMessage('contextPage'),
      contexts,
    });

    if (page && groups.length > 0) {
      groups.forEach((item, index) => {
        ui.pageContextMenu(item.id, item.name || ui.getMessage('optionsConfig') + ' ' + (index + 1).toString(), true);
      });
    }
  });
});

chrome.contextMenus.onClicked.addListener(info => {
  if (!chrome.runtime.lastError && info) {
    const { menuItemId, checked, wasChecked } = info;
    chrome.storage.local.get(['groups'], res => {
      const { groups = [] } = res;
      if (menuItemId === 'contextPage' && checked !== wasChecked) {
        chrome.storage.local.set({
          page: checked,
        });

        if (groups.length > 0) {
          groups.forEach((item, index) => {
            ui.pageContextMenu(item.id, item.name || ui.getMessage('optionsConfig') + ' ' + (index + 1).toString(), checked);
          });
        }
      } else {
        //* page-context
        operation.open(groups, menuItemId);
      }
    });
  }
});

if (process.env.VUE_APP_MANIFEST === 'v3') {
  chrome.action.onClicked.addListener(() => {
    if (!chrome.runtime.lastError) {
      chrome.storage.local.get(['groups'], res => {
        const { groups = [] } = res;
        operation.open(groups);
      });
    }
  });
} else {
  chrome.browserAction.onClicked.addListener(() => {
    if (!chrome.runtime.lastError) {
      chrome.storage.local.get(['groups'], res => {
        const { groups = [] } = res;
        operation.open(groups);
      });
    }
  });
}
