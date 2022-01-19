<template>
  <div id="options-app">
    <el-container class="options-container">
      <el-header class="options-header">
        <el-button type="primary" @click="onSave">{{ $ui.get('notifySave') }}</el-button>
      </el-header>
      <el-main>
        <el-input v-model="prefix" autofocus :placeholder="$ui.get('optionsInputPlaceholder')">
          <template slot="prepend">{{ $ui.get('optionsSplice') }}</template>
        </el-input>
        <div class="options-settings">
          <span class="options-label">
            {{ $ui.get('optionsType') }}
          </span>
          <el-radio v-model="type" label="1" title="e.g., hppts://www.example.com/path/to/test.php?type=0#extra">href</el-radio>
          <el-radio v-model="type" label="2" title="e.g., www.example.com/path/to/test.php?type=0#extra">link</el-radio>
          <el-radio v-model="type" label="3" title="e.g., hppts://www.example.com">origin</el-radio>
          <el-radio v-model="type" label="4" title="e.g., www.example.com">hostname</el-radio>
          <el-radio v-model="type" label="5" title="e.g., /path/to/test.php?type=0#extra">path</el-radio>
        </div>
        <div class="options-settings">
          <span class="options-label">
            {{ $ui.get('optionsOpen') }}
          </span>
          <el-radio v-model="mode" label="1">{{ $ui.get('optionsCurrent') }}</el-radio>
          <el-radio v-model="mode" label="2">{{ $ui.get('optionsNewTab') }}</el-radio>
          <el-radio v-model="mode" label="3">{{ $ui.get('optionsNewWindow') }}</el-radio>
        </div>
        <div class="options-settings">
          <a class="options-shortcuts" target="_blank" @click="onShortcuts">
            {{ $ui.get('optionsShortcuts') }}
          </a>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      prefix: '',
      type: '1',
      mode: '1',
    };
  },
  methods: {
    onSave() {
      chrome.storage.local.set(
        {
          prefix: this.prefix || '',
          type: this.type || '1',
          mode: this.mode || '1',
        },
        () => {
          this.$notify({
            title: this.$ui.get('notifySave'),
            message: this.$ui.get('notifySaveMsg'),
            type: 'success',
            duration: 2000,
          });
        }
      );
    },
    onShortcuts(e) {
      e.stopPropagation();
      chrome.tabs.create({
        url: 'chrome://extensions/shortcuts#:~:text=Splicing%20URL%20',
      });
    },
  },
  mounted() {
    chrome.storage.local.get(['prefix', 'type', 'mode'], res => {
      const { prefix, type, mode } = res;
      this.prefix = prefix || '';
      this.type = type || '1';
      this.mode = mode || '1';
    });
  },
};
</script>

<style>
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
  color: #1890ff;
  cursor: pointer;
}
</style>
