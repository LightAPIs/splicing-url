<template>
  <div class="options-group">
    <el-card :class="{ 'options-group-highlight': vActive }" shadow="always">
      <div slot="header">
        <span class="options-group-header" :class="{ 'options-group-header-highlight': vActive }">{{
          vName || $ui.get('optionsConfig') + ' ' + index.toString()
        }}</span>
        <el-button v-if="!vActive" class="float-right" type="danger" @click="onDelete">{{ $ui.get('optionsDel') }}</el-button>
        <el-button class="float-right" :type="vActive ? 'warning' : 'success'" @click="onActive">{{
          vActive ? $ui.get('optionsFreeze') : $ui.get('optionsActive')
        }}</el-button>
        <el-button class="float-right" type="info" @click="onRename">{{ $ui.get('optionsRename') }}</el-button>
      </div>
      <div>
        <el-row type="flex" :gutter="10">
          <el-col :span="20">
            <el-input v-model="vCmd" :disabled="!isEdit" :placeholder="$ui.get('optionsInputPlaceholder')" @keydown.native="onKeyDown">
              <template slot="prepend">{{ $ui.get('optionsSplice') }}</template>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button :type="isEdit ? 'warning' : 'primary'" @click="onEdit">{{
              isEdit ? $ui.get('optionsSave') : $ui.get('optionsEdit')
            }}</el-button>
          </el-col>
        </el-row>
        <div class="options-settings">
          <span class="options-label">
            {{ $ui.get('optionsType') }}
          </span>
          <span class="options-tag-group">
            <el-tag title="e.g., hppts://www.example.com/path/to/test.php?type=0#extra" @click="onTagClick('{HREF}')">{HREF}</el-tag>
            <el-tag type="success" title="e.g., www.example.com/path/to/test.php?type=0#extra" @click="onTagClick('{LINK}')">{LINK}</el-tag>
            <el-tag type="info" title="e.g., hppts://www.example.com" @click="onTagClick('{ORIGIN}')">{ORIGIN}</el-tag>
            <el-tag type="warning" title="e.g., www.example.com" @click="onTagClick('{HOSTNAME}')">{HOSTNAME}</el-tag>
            <el-tag type="danger" title="e.g., /path/to/test.php?type=0#extra" @click="onTagClick('{PATH}')">{PATH}</el-tag>
          </span>
        </div>
        <div class="options-settings">
          <span class="options-label">
            {{ $ui.get('optionsOpen') }}
          </span>
          <el-radio-group v-model="vMode" @change="onModeChange">
            <el-radio label="1">{{ $ui.get('optionsCurrent') }}</el-radio>
            <el-radio label="2">{{ $ui.get('optionsNewTab') }}</el-radio>
            <el-radio label="3">{{ $ui.get('optionsNewWindow') }}</el-radio>
          </el-radio-group>
        </div>
        <div class="options-settings">
          <span class="options-label">
            {{ $ui.get('optionsFocus') }}
          </span>
          <el-radio-group v-model="vFocus" @change="onFocusChange">
            <el-radio label="1">{{ $ui.get('optionsFront') }}</el-radio>
            <el-radio label="2">{{ $ui.get('optionsBackground') }}</el-radio>
          </el-radio-group>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'OptionsGroup',
  props: {
    id: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      default: '',
    },
    cmd: {
      type: String,
      default: '',
    },
    mode: {
      type: String,
      default: '1',
    },
    focus: {
      type: String,
      default: '1',
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      vName: this.name,
      vCmd: this.cmd,
      vMode: this.mode,
      vFocus: this.focus,
      vActive: this.active,
      isEdit: false,
    };
  },
  methods: {
    onEdit() {
      if (this.isEdit) {
        this.isEdit = false;
        this.$emit('saveEvent', {
          id: this.id,
          key: 'cmd',
          val: this.vCmd,
        });
      } else {
        this.isEdit = true;
      }
    },
    onKeyDown(event) {
      if (event.keyCode === 13 && this.isEdit) {
        this.onEdit();
      }
    },
    onModeChange(value) {
      this.$emit('saveEvent', {
        id: this.id,
        key: 'mode',
        val: value,
      });
    },
    onFocusChange(value) {
      this.$emit('saveEvent', {
        id: this.id,
        key: 'focus',
        val: value,
      });
    },
    onDelete() {
      this.$emit('deleteEvent', this.id);
    },
    onActive() {
      if (this.vActive) {
        this.vActive = false;
      } else {
        this.vActive = true;
      }

      this.$emit('saveEvent', {
        id: this.id,
        key: 'active',
        val: this.vActive,
      });
    },
    onRename() {
      this.$msg
        .prompt(this.$ui.get('optionsEnterName'), this.$ui.get('optionsRename'), {
          confirmButtonText: this.$ui.get('optionsConfirm'),
          cancelButtonText: this.$ui.get('optionsCancel'),
        })
        .then(({ value }) => {
          this.vName = value;
          this.$emit('saveEvent', {
            id: this.id,
            key: 'name',
            val: this.vName,
          });
        })
        .catch(() => {});
    },
    onTagClick(val) {
      if (this.isEdit) {
        this.vCmd += val;
      }
    },
  },
};
</script>

<style>
.options-tag-group span {
  cursor: pointer;
  margin: 0 5px;
  user-select: none;
}
</style>
