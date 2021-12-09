<template>
  <q-card dark class="bg-grey-10" style="width:50vw; max-width: 600px;">
    <q-toolbar>
      <q-avatar>
        <q-icon size="md" name="mdi-cog" />
      </q-avatar>
      <q-toolbar-title>Settings</q-toolbar-title>
      <q-btn flat round dense icon="close" v-close-popup />
    </q-toolbar>

    <q-item>
      <q-item-section>
        <q-item-label>Icon Size</q-item-label>
        <q-item-label caption>
          Adjusts the size of the icons
        </q-item-label>
      </q-item-section>
      <q-item-section>
        <q-slider
          label
          v-model="settings.iconSize"
          :min="48"
          :max="128"
          :step="1"
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-item-label>Config</q-item-label>
        <q-item-label caption>
          Path to json config file
        </q-item-label>
      </q-item-section>
      <q-item-section>
        <q-input
          rounded
          dense
          standout
          readonly
          v-model="settings.configFilepath"
        >
          <template v-slot:append>
            <q-icon
              name="mdi-folder"
              class="cursor-pointer"
              @click="selectConfigFile"
            />
          </template>
        </q-input>
      </q-item-section>
    </q-item>

    <q-separator spaced />

    <q-card-actions align="right">
      <!-- <q-btn flat v-close-popup>Cancel</q-btn> -->
      <q-btn color="blue" v-close-popup>OK</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, reactive, onUnmounted } from '@vue/composition-api';
import * as utils from 'src/utils';
import { AppSettings } from 'src/models/types';

export default defineComponent({
  name: 'SettingsPanel',
  props: {},

  setup(props, { emit, root }) {
    const settings: AppSettings = reactive({
      ...root.$store.getters['app/settings']
    });

    onUnmounted(() => {
      root.$store.dispatch('app/setSettings', settings);
    });

    return {
      settings,
      selectConfigFile: () => {
        const filepath = utils.selectConfigFile();
        if (filepath) {
          settings.configFilepath = filepath;
        }
      }
    };
  }
});
</script>
