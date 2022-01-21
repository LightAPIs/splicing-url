<template>
  <div class="options-group">
    <el-card :class="{ 'options-group-highlight': highlight }" shadow="always">
      <div slot="header">
        <span class="options-group-header" :class="{ 'options-group-header-highlight': highlight }">{{
          vName || $ui.get('optionsConfig') + ' ' + index.toString()
        }}</span>
        <el-button v-if="!highlight" class="float-right" type="danger" @click="onDelete">{{ $ui.get('optionsDel') }}</el-button>
        <el-button v-if="!highlight" class="float-right" type="success" @click="onActive">{{ $ui.get('optionsActive') }}</el-button>
        <el-button class="float-right" type="info" @click="onRename">{{ $ui.get('optionsRename') }}</el-button>
      </div>
      <div>
        <el-row type="flex" :gutter="10">
          <el-col :span="20">
            <el-input v-model="vPrefix" :disabled="!isEdit" :placeholder="$ui.get('optionsInputPlaceholder')">
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
          <el-radio-group v-model="vType" @change="onTypeChange">
            <el-radio label="1" title="e.g., hppts://www.example.com/path/to/test.php?type=0#extra">href</el-radio>
            <el-radio label="2" title="e.g., www.example.com/path/to/test.php?type=0#extra">link</el-radio>
            <el-radio label="3" title="e.g., hppts://www.example.com">origin</el-radio>
            <el-radio label="4" title="e.g., www.example.com">hostname</el-radio>
            <el-radio label="5" title="e.g., /path/to/test.php?type=0#extra">path</el-radio>
          </el-radio-group>
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
    prefix: {
      type: String,
      default: '',
    },
    typeValue: {
      type: String,
      default: '1',
    },
    mode: {
      type: String,
      default: '1',
    },
    highlight: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      vName: this.name,
      vPrefix: this.prefix,
      vType: this.typeValue,
      vMode: this.mode,
      isEdit: false,
    };
  },
  methods: {
    onEdit() {
      if (this.isEdit) {
        this.isEdit = false;
        this.$emit('saveEvent', {
          id: this.id,
          key: 'prefix',
          val: this.vPrefix,
        });
      } else {
        this.isEdit = true;
      }
    },
    onTypeChange(value) {
      this.$emit('saveEvent', {
        id: this.id,
        key: 'type',
        val: value,
      });
    },
    onModeChange(value) {
      this.$emit('saveEvent', {
        id: this.id,
        key: 'mode',
        val: value,
      });
    },
    onDelete() {
      this.$emit('deleteEvent', this.id);
    },
    onActive() {
      this.$emit('activeEvent', this.id);
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
  },
};
</script>
