'use strict';

import ui from '../common/ui';
import operation from '../common/operation';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['page', 'groups'], res => {
    const { page, groups = [] } = res;
    chrome.contextMenus.create({
      id: 'contextPage',
      type: 'checkbox',
      checked: page === true,
      title: ui.get('contextPage'),
      contexts: ['browser_action'],
    });

    if (page && groups.length > 0) {
      groups.forEach((item, index) => {
        ui.pageContextMenu(item.id, item.name || ui.get('optionsConfig') + ' ' + (index + 1).toString(), true);
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
            ui.pageContextMenu(item.id, item.name || ui.get('optionsConfig') + ' ' + (index + 1).toString(), checked);
          });
        }
      } else {
        //* page-context
        operation.open(groups, menuItemId);
      }
    });
  }
});

chrome.browserAction.onClicked.addListener(() => {
  if (!chrome.runtime.lastError) {
    chrome.storage.local.get(['groups', 'active'], res => {
      const { groups = [], active = '' } = res;
      operation.open(groups, active);
    });
  }
});
