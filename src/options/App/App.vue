<template>
  <div id="options-app">
    <el-container class="options-container">
      <el-header class="options-header">
        <el-button type="primary" @click="onAdd">{{ $ui.get('optionsAdd') }}</el-button>
        <a class="options-shortcuts" target="_blank" @click="onShortcuts">
          {{ $ui.get('optionsShortcuts') }}
        </a>
      </el-header>
      <el-main>
        <template v-for="(item, index) in groups">
          <options-group
            v-if="exists.includes(item.id)"
            :key="index"
            :id="item.id"
            :index="index + 1"
            :name="item.name"
            :cmd="item.cmd"
            :mode="item.mode"
            :focus="item.focus"
            :active="item.active"
            @saveEvent="onSave"
            @deleteEvent="onDelete"
          ></options-group>
        </template>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import OptionsGroup from '../../components/OptionsGroup.vue';

export default {
  name: 'App',
  components: {
    OptionsGroup,
  },
  data() {
    return {
      groups: [],
      exists: [],
    };
  },
  methods: {
    onSave(event) {
      const { id, key, val } = event;
      let update = false;
      let index = 0;
      for (const item of this.groups) {
        index++;
        if (item.id === id) {
          item[key] = val;
          update = true;
          break;
        }
      }

      if (update) {
        const saveGroups = [];
        this.groups.forEach(item => {
          if (this.exists.includes(item.id)) {
            saveGroups.push(item);
          }
        });
        chrome.storage.local.set({
          cmd_groups: saveGroups,
        });

        if (key === 'name') {
          chrome.storage.local.get(['page'], res => {
            const { page } = res;
            if (page) {
              this.$ui.updateContextMenu(id, val || this.$ui.get('optionsConfig') + ' ' + index.toString());
            }
          });
        }
      }
    },
    onDelete(id) {
      if (this.exists.length > 0) {
        let del = false;
        for (let i = 0; i < this.exists.length; i++) {
          if (this.exists[i] === id) {
            this.exists.splice(i, 1);
            del = true;
            break;
          }
        }

        if (del) {
          const saveGroups = [];
          this.groups.forEach(item => {
            if (this.exists.includes(item.id)) {
              saveGroups.push(item);
            }
          });
          chrome.storage.local.set({
            cmd_groups: saveGroups,
          });

          chrome.storage.local.get(['page'], res => {
            const { page } = res;
            if (page) {
              this.$ui.pageContextMenu(id, '', false);
            }
          });
        }
      }
    },
    onAdd() {
      const id = this.$ui.uuid();
      this.groups.push({
        id,
        name: '',
        cmd: '',
        mode: '1',
        focus: '1',
        active: false,
      });
      this.exists.push(id);

      const saveGroups = [];
      this.groups.forEach(item => {
        if (this.exists.includes(item.id)) {
          saveGroups.push(item);
        }
      });
      chrome.storage.local.set({
        cmd_groups: saveGroups,
      });

      chrome.storage.local.get(['page'], res => {
        const { page } = res;
        if (page) {
          this.$ui.pageContextMenu(id, this.$ui.get('optionsConfig') + ' ' + this.groups.length.toString(), true);
        }
      });
    },
    onShortcuts(e) {
      e.stopPropagation();
      chrome.tabs.create({
        url: 'chrome://extensions/shortcuts#:~:text=Splicing%20URL',
      });
    },
  },
  mounted() {
    chrome.storage.local.get(['cmd_groups'], res => {
      const { cmd_groups = [] } = res;
      this.groups = Object.assign([], cmd_groups);
      this.groups.forEach(item => {
        this.exists.push(item.id);
      });
    });
  },
};
</script>

<style>
.options-header {
  height: 40px;
}
.options-settings {
  margin-top: 25px;
}
.options-label {
  margin-right: 15px;
}
.options-label,
.options-shortcuts {
  font-size: 18px;
}
.options-shortcuts {
  float: right;
  color: #1890ff;
  cursor: pointer;
}
.options-group {
  margin-bottom: 15px;
}
.options-group-header {
  font-size: 24px;
}
.options-group-header-highlight {
  color: #31b931;
}
.options-group-highlight {
  box-shadow: 0px 0px 10px 5px green !important;
}
.float-right {
  float: right;
  margin-left: 10px;
}
</style>
