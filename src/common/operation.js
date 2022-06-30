'use strict';

const operation = {
  open(groups = [], id = null) {
    if (id) {
      let used = {
        id: 'none',
        name: '',
        mode: '1',
        focus: '1',
        active: false,
        cmd: '',
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
          const { cmd = '', mode = '1', focus = '1' } = used;
          this._openUrl(tabUrl, tabId, cmd, mode, focus);
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
              const { cmd = '', mode = '1', focus } = ele;
              this._openUrl(tabUrl, tabId, cmd, mode, focus);
            }, interval * index);
          });
        }
      });
    }
  },
  _openUrl(tabUrl, tabId, cmd = '', mode = '1', focus = '1') {
    const uri = new URL(tabUrl);
    const openUrl = this._convertCmd(uri, cmd);

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
  _convertCmd(uri, cmd) {
    return cmd.replace(/{[^{}]+?}/g, arg0 => {
      switch (arg0) {
        case '{HREF}':
          return uri.href;
        case '{LINK}':
          return uri.href.replace(uri.protocol + '//', '');
        case '{ORIGIN}':
          return uri.origin;
        case '{HOSTNAME}':
          return uri.hostname;
        case '{PATH}':
          return uri.href.replace(uri.origin, '');
        default:
          return arg0;
      }
    });
  },
};

export default operation;
