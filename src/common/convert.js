'use strict';

const convert = {
  old2New(oldGroups) {
    const newGroups = [];
    for (const group of oldGroups) {
      const { id, active = false, focus = '1', mode = '1', name = '', prefix = '', type = '1' } = group;
      id &&
        newGroups.push({
          id,
          active,
          name,
          focus,
          mode,
          cmd: prefix + this._type2Cmd(type),
        });
    }
    return newGroups;
  },
  _type2Cmd(type) {
    switch (type) {
      case '2':
        return '{LINK}';
      case '3':
        return '{ORIGIN}';
      case '4':
        return '{HOSTNAME}';
      case '5':
        return '{PATH}';
      case '1':
      default:
        return '{HREF}';
    }
  },
};

export default convert;
