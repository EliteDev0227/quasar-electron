<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-grey-9">
        <q-avatar>
          <q-icon size="lg" name="svguse:icons.svg#logo" />
          <q-tooltip :delay="700">Hyv</q-tooltip>
        </q-avatar>

        <q-space />

        <q-input
          dense
          rounded
          standout
          clearable
          class="q-mx-xs"
          placeholder="Search"
          :value="filters.searchQuery"
          @input="ev => updateFilter({ searchQuery: ev })"
        >
          <template v-slot:prepend>
            <q-icon name="mdi-magnify" />
          </template>
        </q-input>

        <q-btn
          flat
          round
          dense
          class="q-mx-xs"
          :icon="filters.showHidden ? 'mdi-lightbulb' : 'mdi-lightbulb-outline'"
          :value="filters.showHidden"
          @click="ev => updateFilter({ showHidden: !filters.showHidden })"
        >
          <q-tooltip :delay="700">
            Hidden Toggle
            <br />
            <span class="text-italic">
              Toggles visibility of hidden apps
            </span>
          </q-tooltip>
        </q-btn>

        <q-separator inset spaced vertical />

        <q-btn
          flat
          round
          dense
          icon="mdi-cog"
          class="q-mx-xs"
          @click="showSettingsPanel = !showSettingsPanel"
        >
          <q-tooltip :delay="700">Settings</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-dialog v-model="showSettingsPanel">
      <SettingsPanel />
    </q-dialog>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import SettingsPanel from 'components/SettingsPanel.vue';
import {
  defineComponent,
  ref,
  ComputedRef,
  computed
} from '@vue/composition-api';
import { FilterState } from '../models/types';

export default defineComponent({
  name: 'MainLayout',
  components: { SettingsPanel },
  setup(props, { root }) {
    const showSettingsPanel = ref(false);
    const searchQuery = ref('');
    const loading = false;

    const filters: ComputedRef<FilterState> = computed(
      () => root.$store.getters['app/filters']
    );

    const updateFilter = (filters: Partial<FilterState>) => {
      root.$store.dispatch('app/updateFilter', filters);
    };

    return {
      showSettingsPanel,
      updateFilter,
      filters,
      loading,
      searchQuery
    };
  }
});
</script>
