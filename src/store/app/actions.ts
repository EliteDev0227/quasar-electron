import { ActionTree } from 'vuex';
import axios from 'axios';

import { StateInterface } from '../index';
import { AppState, AppItem, AppSettings, FilterState } from 'src/models/types';
import * as utils from 'src/utils';

import path from 'path';
import chokidar from 'chokidar';

const actions: ActionTree<AppState, StateInterface> = {
  async loadConfigFile({ commit, state, dispatch }) {
    commit('setIsBusy', true);
    const fp = state.settings.configFilepath;
    const currentAppItems = state.appItems;
    const data = await utils.parseConfig(fp, currentAppItems);

    commit('setAppItems', data.appItems);
    commit('setCategories', data.categories);

    // Run file watcher
    dispatch('setFileWatcher');

    commit('setIsBusy', false);
  },

  setFileWatcher({ state, dispatch }) {
    const watcher = chokidar.watch(state.settings.configFilepath, {
      depth: 0,
      ignorePermissionErrors: true
    });

    if (watcher) {
      watcher
        .on('ready', () => {
          console.log('FileWatcher monitoring >> ', watcher.getWatched());
        })
        .on('change', path => {
          dispatch('loadConfigFile');
          console.log('FileWatcher changed emitted >>', path);
        })
        .on('error', error => {
          console.error(error);
        });
    }
  },

  setSettings({ commit, dispatch }, payload: Partial<AppSettings>) {
    commit('setSettings', payload);
    dispatch('loadConfigFile');
    dispatch('setFileWatcher');
  },

  updateFilter({ commit }, payload: Partial<FilterState>) {
    commit('setFilters', payload);
  },

  updateAppItem(
    { state, commit },
    update: { uid: string; updates: Partial<AppItem> }
  ): void {
    const newAppItems = state.appItems.map(appItem => {
      if (appItem.uid == update.uid) {
        return { ...appItem, ...update.updates };
      } else return appItem;
    });

    commit('setAppItems', newAppItems);
  },

  updateAppItems({ state, commit }, appItems: AppItem[]): void {
    const newAppItems = state.appItems.map(existingItem => {
      const appItem = appItems.find(item => item.uid === existingItem.uid);
      if (appItem) {
        return {  ...existingItem, ...appItem };
      } else return existingItem;
    });

    commit('setAppItems', newAppItems);
  },

  executeItem(
    { state, commit },
    { item, profileId }: { item: AppItem; profileId: number }
  ): void {
    console.log('execute', item.profiles[profileId]);
  },

  unhideAllApps({ commit, state }) {
    const newAppItems = state.appItems.map(appItem => {
      return { ...appItem, isHidden: false };
    });

    commit('setAppItems', newAppItems);
  }
};

export default actions;
