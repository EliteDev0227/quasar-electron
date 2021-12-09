<template>
  <q-page>
    <!-- debug -->
    <q-card hidden class="bg-grey-10 q-ma-sm q-pa-sm" style="font-size:10px;">
      <q-list>
        <q-item>
          <q-item-section>
            <q-item-label overline>General</q-item-label>
            <q-item-label caption>
              <pre> isBusy: {{ isBusy }} </pre>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item>
          <q-item-section>
            <q-item-label overline>Filters</q-item-label>
            <q-item-label caption>
              <pre> {{ filters }} </pre>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item>
          <q-item-section>
            <q-item-label overline>Settings</q-item-label>
            <q-item-label caption>
              <pre> {{ settings }} </pre>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item>
          <q-item-section>
            <q-item-label overline>Categories</q-item-label>
            <q-item-label caption>
              <pre> {{ categories }} </pre>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <!-- displaying apps -->
    <q-list>
      <q-expansion-item
        expand-separator
        v-for="cat in categories"
        :icon="cat.icon"
        :label="cat.name"
        :key="cat.name"
      >
        <q-card>
          <q-card-section>
            <draggable
              :value="getAppItemsByCategory(cat.name)"
              class="row q-gutter-sm"
              @change="onDragChange"
            >
              <AppItemCard
                v-for="(item, index) in getAppItemsByCategory(cat.name)"
                :key="index"
                :item="item"
              />
            </draggable>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, computed } from '@vue/composition-api';
import { AppItem, Category } from 'src/models/types';
import AppItemCard from 'components/AppItemCard.vue';
import draggable from 'vuedraggable';
export default defineComponent({
  name: 'PageIndex',
  components: {
    AppItemCard,
    draggable
  },
  setup(props, { root }) {
    const appConfig = computed<AppItem[]>(
      () => root.$store.getters['app/config']
    );

    const isBusy = computed<boolean>(() => root.$store.getters['app/isBusy']);
    const categories = computed<Category[]>(
      () => root.$store.getters['app/categories']
    );
    const appItems = computed<AppItem[]>(
      () => root.$store.getters['app/appItems']
    );
    const settings = computed(() => root.$store.getters['app/settings']);
    const filters = computed(() => root.$store.getters['app/filters']);

    const getAppItemsByCategory = (name: string) => {
      console.log(filters.value.searchQuery);
      return appItems.value
        .filter((item: AppItem) => item.category === name)
        .sort((item1, item2) => item1.order - item2.order)
        .filter((item: AppItem) => {
          if (!filters.value.searchQuery) return true;
          try {
            return (
              item.profiles[item.selectedProfileId].name
                .toLowerCase()
                .indexOf(filters.value.searchQuery.toLowerCase()) !== -1
            );
          } catch (err) {
            return false
          }
        });
    };

    const expanded = ref(true);

    const onDragChange = ev => {
      if (ev.moved) {
        // Asume this is category, exchange the items sort order.
        const appItems = JSON.parse(
          JSON.stringify(getAppItemsByCategory(ev.moved.element.category))
        );
        if (ev.moved.newIndex === ev.moved.oldIndex) {
          return;
        }

        const step = ev.moved.newIndex >= ev.moved.oldIndex ? -1 : 1;

        let currentIndex = ev.moved.newIndex;
        let nextIndex = (ev.moved.newIndex as number) + step;
        const orderBackup = appItems[ev.moved.newIndex].order;

        while (1) {
          appItems[currentIndex].order = appItems[nextIndex].order;
          if (nextIndex === ev.moved.oldIndex) {
            appItems[nextIndex].order = orderBackup;
            break;
          }
          currentIndex = nextIndex;
          nextIndex += step;
        }

        root.$store.dispatch('app/updateAppItems', appItems);
      }
    };
    return {
      expanded,
      appConfig,
      isBusy,
      categories,
      appItems,
      settings,
      filters,
      getAppItemsByCategory,
      onDragChange
    };
  },
  computed: {
    filterAppsList: function(): AppItem[] {
      return this.appConfig.filter((item: AppItem): boolean => {
        // console.log(item.name, this.appFilter, item.name.toLowerCase().search(this.appFilter));

        if (this.appFilter) {
          // return item.name.toLowerCase().search(this.appFilter) > -1;
          // TODO
          // It should try match with item.platforms[].nam,
          // and use indexOf, not search
          // And this.appFilter also lowercase
          return true;
        } else {
          return true;
        }
      });
    }
  }
});
</script>
