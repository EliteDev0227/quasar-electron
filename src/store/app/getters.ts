import { GetterTree } from 'vuex';

import { StateInterface } from '../index';
import { AppState } from 'src/models/types';

const getters: GetterTree<AppState, StateInterface> = {
  categories: state => state.categories,
  appItems: state => state.appItems,
  isBusy: state => state.isBusy,
  settings: state => state.settings,
  filters: state => state.filters,
};

export default getters;
