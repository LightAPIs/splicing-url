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
        <options-group
          v-for="(item, index) in groups"
          :key="index"
          :id="item.id"
          :index="index + 1"
          :name="item.name"
          :prefix="item.prefix"
          :type-value="item.type"
          :mode="item.mode"
          :highlight="active === item.id"
          @saveEvent="onSave"
          @deleteEvent="onDelete"
          @activeEvent="onActive"
        ></options-group>
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
      active: '',
    };
  },
  methods: {
    onSave(event) {
      const { id, key, val } = event;
      for (const item of this.groups) {
        if (item.id === id) {
          item[key] = val;
          break;
        }
      }

      chrome.storage.local.set({
        groups: this.groups || [],
        active: this.active || '',
      });
    },
    onDelete(id) {
      if (this.groups.length > 1 && id !== this.active) {
        let del = false;
        for (let i = 0; i < this.groups.length; i++) {
          if (this.groups[i].id === id) {
            this.groups.splice(i, 1);
            del = true;
            break;
          }
        }

        del &&
          chrome.storage.local.set({
            groups: this.groups || [],
          });
      }
    },
    onActive(id) {
      if (id !== this.active) {
        this.active = id;
        chrome.storage.local.set({
          active: this.active || '',
        });
      }
    },
    onAdd() {
      this.groups.push({
        id: this.$ui.uuid(),
        name: '',
        prefix: '',
        type: '1',
        mode: '1',
      });

      chrome.storage.local.set({
        groups: this.groups || [],
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
    chrome.storage.local.get(['groups', 'active'], res => {
      const { groups = [], active = '' } = res;
      if (groups.length === 0) {
        const id = this.$ui.uuid();
        this.groups.push({
          id,
          name: '',
          prefix: '',
          type: '1',
          mode: '1',
        });
        this.active = id;
      } else {
        this.groups = Object.assign([], groups);
        this.active = active || this.groups[0].id;
      }
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
.options-group-highlight {
  box-shadow: 0px 0px 10px 5px green !important;
}
.float-right {
  float: right;
  margin-left: 10px;
}
</style>
