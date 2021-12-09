import { AppState } from 'src/models/types';
import path from 'path';

const state: AppState = {
  isBusy: false,
  categories: [],
  appItems: [],
  settings: {
    iconSize: 64,
    configFilepath: path.join(process.cwd(), 'public/json/config.json')
  },
  filters: {
    searchQuery: '',
    showHidden: false
  }
};

export default state;
