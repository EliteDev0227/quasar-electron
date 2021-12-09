import { store } from 'quasar/wrappers';
import Vuex from 'vuex';
import { createPersistedState } from 'vuex-electron';

import app from './app';
import { AppState } from 'src/models/types';

export interface StateInterface {
  app: AppState;
}

const vuexElectonPlugin = createPersistedState({
  // whitelist: (mutation) => {
  //   return true
  // },
  // blacklist: (mutation) => {
  //   debugger
  //   return true
  // }
});

export default store(function({ Vue }) {
  Vue.use(Vuex);

  const Store = new Vuex.Store<StateInterface>({
    modules: {
      app
    },
    plugins: [vuexElectonPlugin],
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEBUGGING
  });

  return Store;
});
