import { MutationTree } from 'vuex';

import { AppState, AppSettings, Category, FilterState, AppItem } from 'src/models/types';

const mutation: MutationTree<AppState> = {
  setCategories(state, payload: Category[]) {
    state.categories = payload;
  },
  setAppItems(state, payload: AppItem[]) {
    state.appItems = payload;
  },
  setIsBusy(state, payload: boolean) {
    state.isBusy = payload;
  },
  setConfigFilepath(state, payload: string) {
    state.settings.configFilepath = payload;
  },
  setSettings(state, payload: Partial<AppSettings>) {
    state.settings = {
      ...state.settings,
      ...payload
    };
  },
  setFilters (state, payload: Partial<FilterState>): void {
    state.filters = {
      ...state.filters,
      ...payload,
    }
  },
  setIsAppHidden (state, payload: any): void {
    state.appItems[payload.index].isHidden = payload.value
  }
};

export default mutation;
