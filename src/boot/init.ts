import { boot } from 'quasar/wrappers';

export default boot(({ app }) => {
  app.store && void app.store.dispatch('app/loadConfigFile');
});
