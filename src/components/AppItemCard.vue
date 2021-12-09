<template>
  <q-card
    v-if="!item.isHidden || filters.showHidden"
    flat
    class="column items-center flex q-pa-sm bg-grey-10 app-item-card"
  >
    <!-- <q-icon size="64px" name="svguse:icons.svg#nullApp" /> -->
    <!-- <q-icon size="64px" :name="item.icon" /> -->
    <q-btn flat padding="xs" @click="onHandleClick">
      <div
        style="animation-duration: 0.7s;"
        :class="{ 'bounceIn animated': isAnimated }"
        @animationend="isAnimated = false"
      >
        <q-img
          :width="`${settings.iconSize}px`"
          :height="`${settings.iconSize}px`"
          :src="item.icon"
          :style="item.isHidden ? 'opacity:0.5; filter: blur(2px);' : ''"
        />
        <!-- style="opacity: 0.5; filter: blur(2px);" -->

        <!-- <q-badge
        floating
        color="red"
        v-if="item.children[0].status"
        class="q-mt-md"
      >
        {{ item.children[0].status }}
      </q-badge> -->
      </div>
    </q-btn>

    <!-- <q-tooltip :delay="700" v-if="item.description">
      {{ item.description }}
    </q-tooltip> -->

    <q-select
      :hide-dropdown-icon="item.profiles.length == 1"
      :readonly="item.profiles.length == 1"
      dense
      borderless
      :options="item.profiles"
      :value="item.profiles[item.selectedProfileId]"
      @input="val => onChangeSelectedProfileId(item, val)"
      option-value="id"
      option-label="name"
      class="text-caption text-center"
    >
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
          <q-item-section avatar>
            <q-icon size="lg" :name="`img:/app-icons/${item.icon}`" />
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1"> {{ scope.opt.name }} </q-item-label>
            <q-item-label lines="2" caption>
              {{ scope.opt.description }}
            </q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-badge color="red" v-if="scope.opt.status">
              {{ scope.opt.status }}
            </q-badge>
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <!-- context menu -->
    <q-menu touch-position context-menu>
      <q-list style="min-width: 100px" class="bg-grey-9">
        <q-item
          v-if="!item.isHidden"
          clickable
          v-close-popup
          @click="toggleAppHidden(item)"
        >
          <q-item-section side>
            <q-icon name="mdi-lightbulb" />
          </q-item-section>
          <q-item-section>Hide</q-item-section>
        </q-item>
        <q-item
          v-if="item.isHidden"
          clickable
          v-close-popup
          @click="toggleAppHidden(item)"
        >
          <q-item-section side>
            <q-icon name="mdi-lightbulb-outline" />
          </q-item-section>
          <q-item-section>Unhide</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-close-popup @click="unhideAllApps()">
          <q-item-section side>
            <q-icon name="mdi-lightbulb-outline" />
          </q-item-section>
          <q-item-section>Unhide All</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-card>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  watch,
  toRef
} from '@vue/composition-api';
import { AppItem } from 'src/models/types';

export default defineComponent({
  name: 'AppItemCard',
  components: {},
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit, root }) {
    const settings = computed(() => root.$store.getters['app/settings']);
    const isAnimated = ref(false);
    const filters = computed(() => root.$store.getters['app/filters']);

    const onHandleClick = () => {
      isAnimated.value = true;

      executeItem(props.item);
    };

    const toggleAppHidden = (item: AppItem) => {
      void root.$store.dispatch('app/updateAppItem', {
        uid: item.uid,
        updates: {
          isHidden: !item.isHidden
        }
      });
    };

    const unhideAllApps = () => {
      void root.$store.dispatch('app/unhideAllApps');
    };

    const onChangeSelectedProfileId = (item: AppItem, val: any) => {
      const index = item.profiles.indexOf(val);
      if (index !== -1) {
        root.$store.dispatch('app/updateAppItem', {
          uid: item.uid,
          updates: {
            selectedProfileId: index
          }
        });
        executeItem(item, index);
      }
    };

    const executeItem = (item: AppItem, profileId?: number) => {
      root.$store.dispatch('app/executeItem', {
        item: item,
        profileId: profileId || item.selectedProfileId
      });
    };

    return {
      filters,
      settings,
      isAnimated,
      onHandleClick: onHandleClick,
      toggleAppHidden,
      unhideAllApps: unhideAllApps,
      onChangeSelectedProfileId,
      executeItem
    };
  }
});
</script>
<style lang="scss" scoped>
.app-item-card {
  width: 100px;
}
::v-deep .q-field__native {
  text-align: center;
}
</style>
