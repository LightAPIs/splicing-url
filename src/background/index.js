'use strict';

import ui from '../common/ui';
import operation from '../common/operation';
import convert from '../common/convert';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['page', 'cmd_groups', 'groups'], res => {
    const { page, cmd_groups = [], groups = [] } = res;

    if (groups.length > 0) {
      cmd_groups.push(...convert.old2New(groups));
      chrome.storage.local.set({
        cmd_groups,
        groups: [],
      });
    }

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

    if (page && cmd_groups.length > 0) {
      cmd_groups.forEach((item, index) => {
        ui.pageContextMenu(item.id, item.name || ui.getMessage('optionsConfig') + ' ' + (index + 1).toString(), true);
      });
    }
  });
});

chrome.contextMenus.onClicked.addListener(info => {
  if (!chrome.runtime.lastError && info) {
    const { menuItemId, checked, wasChecked } = info;
    chrome.storage.local.get(['cmd_groups'], res => {
      const { cmd_groups = [] } = res;
      if (menuItemId === 'contextPage' && checked !== wasChecked) {
        chrome.storage.local.set({
          page: checked,
        });

        if (cmd_groups.length > 0) {
          cmd_groups.forEach((item, index) => {
            ui.pageContextMenu(item.id, item.name || ui.getMessage('optionsConfig') + ' ' + (index + 1).toString(), checked);
          });
        }
      } else {
        //* page-context
        operation.open(cmd_groups, menuItemId);
      }
    });
  }
});

if (process.env.VUE_APP_MANIFEST === 'v3') {
  chrome.action.onClicked.addListener(() => {
    if (!chrome.runtime.lastError) {
      chrome.storage.local.get(['cmd_groups'], res => {
        const { cmd_groups = [] } = res;
        operation.open(cmd_groups);
      });
    }
  });
} else {
  chrome.browserAction.onClicked.addListener(() => {
    if (!chrome.runtime.lastError) {
      chrome.storage.local.get(['cmd_groups'], res => {
        const { cmd_groups = [] } = res;
        operation.open(cmd_groups);
      });
    }
  });
}
