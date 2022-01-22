'use strict';

const operation = {
  open(groups = [], id = null) {
    if (id) {
      let used = {
        id: 'none',
        name: '',
        prefix: '',
        type: '1',
        mode: '1',
        focus: '1',
        active: false,
      };
      if (groups.length > 0) {
        let had = false;
        for (const item of groups) {
          if (item.id === id) {
            used = Object.assign(used, item);
            had = true;
            break;
          }
        }

        !had && (used = Object.assign(used, groups[0]));
      }

      chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        if (!chrome.runtime.lastError && tabs && tabs.length > 0) {
          const tabUrl = tabs[0].url;
          const tabId = tabs[0].id;
          const { prefix = '', type = '1', mode = '1', focus = '1' } = used;
          this._openUrl(tabUrl, tabId, prefix, type, mode, focus);
        }
      });
    } else {
      const actived = [];
      groups.forEach(item => {
        if (item.active) {
          actived.push(item);
        }
      });

      chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        if (!chrome.runtime.lastError && tabs && tabs.length > 0) {
          /** default interval: 250ms */
          const interval = 250;
          const tabUrl = tabs[0].url;
          const tabId = tabs[0].id;
          actived.forEach((ele, index) => {
            setTimeout(() => {
              const { prefix = '', type = '1', mode = '1', focus } = ele;
              this._openUrl(tabUrl, tabId, prefix, type, mode, focus);
            }, interval * index);
          });
        }
      });
    }
  },
  _openUrl(tabUrl, tabId, prefix = '', type = '1', mode = '1', focus = '1') {
    let pre = prefix;
    try {
      const preUri = new URL(prefix);
      pre = preUri.href;
    } catch (_e) {
      pre = '';
    }

    const uri = new URL(tabUrl);
    let suffix = '';
    switch (type) {
      case '2':
        suffix = uri.href.replace(uri.protocol + '//', '');
        break;
      case '3':
        suffix = uri.origin;
        break;
      case '4':
        suffix = uri.hostname;
        break;
      case '5':
        suffix = uri.href.replace(uri.origin, '');
        break;
      case '1':
      default:
        suffix = uri.href;
        break;
    }
    const openUrl = pre + suffix;

    switch (mode) {
      case '1':
      default:
        chrome.tabs.update(tabId, { url: openUrl });
        break;
      case '2':
        chrome.tabs.create({
          url: openUrl,
          active: focus === '1',
        });
        break;
      case '3':
        chrome.windows.create({
          url: openUrl,
          state: focus === '1' ? 'normal' : 'minimized',
        });
        break;
    }
  },
};

export default operation;
