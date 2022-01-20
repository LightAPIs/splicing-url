'use strict';

chrome.browserAction.onClicked.addListener(() => {
  if (!chrome.runtime.lastError) {
    chrome.storage.local.get(['groups', 'active'], res => {
      const { groups = [], active = '' } = res;
      let used = {};
      if (groups.length === 0) {
        used = {
          id: 'none',
          prefix: '',
          type: '1',
          mode: '1',
        };
      } else {
        let had = false;
        for (const item of groups) {
          if (item.id === active) {
            used = item;
            had = true;
            break;
          }
        }

        !had && (used = groups[0]);
      }

      const { prefix = '', type = '1', mode = '1' } = used;
      let pre = prefix;
      try {
        const preUri = new URL(prefix);
        pre = preUri.href;
      } catch (_e) {
        pre = '';
      }

      chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        if (!chrome.runtime.lastError && tabs && tabs.length > 0) {
          const uri = new URL(tabs[0].url);
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
              chrome.tabs.update(tabs[0].id, { url: openUrl });
              break;
            case '2':
              chrome.tabs.create({
                url: openUrl,
                active: true,
              });
              break;
            case '3':
              chrome.windows.create({
                url: openUrl,
                focused: true,
              });
              break;
          }
        }
      });
    });
  }
});
