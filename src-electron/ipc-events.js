import { ipcMain, app } from 'electron';

ipcMain.on('get-app-base', (event, arg) => {
  event.reply('set-app-base', { path: app.getAppPath() });
});
