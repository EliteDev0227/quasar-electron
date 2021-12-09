/* eslint-disable */

import iconSet from 'quasar/icon-set/*';
import { AppItem, ProfileItem, CommandItem, Category } from 'src/models/types';

const fs = require('fs');
const path = require('path');
const { remote } = require('electron');
import os from 'os';
import { resolve } from 'dns';
const { ipcRenderer } = require('electron');

const waitForIpc = (eventTo: string, eventToData: any, eventFrom: string) => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send(eventTo, eventToData);
    ipcRenderer.on(eventFrom, (event, arg) => {
      resolve(arg.path);
    });
  });
};
/**
 * Returns path to app icon. Supports both absolute pathing and just a filename.
 * Searches for icon in the following order: Absolute Path, app-icons directory
 * relative to exe, the supplied alternate directory.
 * @param name Absolute path, or filename including extension
 * @param directory Alternate directory to look for icon
 */
export function getAppIcon(
  name: string,
  {
    configFilePath,
    appBasePath
  }: { configFilePath: string; appBasePath: string }
): any {
  let filePath;
  // check if icon is absolute
  if (/^(http|https)/.test(name)) {
    return name;
  }

  // 2. exe file same level
  filePath = path.join(appBasePath, 'app-icons', name);
  if (fs.existsSync(filePath)) {
    return 'data:image/svg+xml;base64,'+ fs.readFileSync(filePath, 'base64');
  }

  // 3. Config file same level
  const appIconsDir = path.join(path.dirname(configFilePath), 'app-icons');
  filePath = path.join(appIconsDir, name);

  if (fs.existsSync(filePath)) {
    return 'data:image/svg+xml;base64,'+ fs.readFileSync(filePath, 'base64');
  }

  return null;
}

function parseProfiles(obj: any): ProfileItem[] {
  const profiles: ProfileItem[] = [];
  const username = os.userInfo().username;

  obj.forEach((item: any) => {
    if (!('name' in item) || !('commands' in item)) {
      return;
    }

    const commandItems: CommandItem[] = [];
    item.commands.forEach((cmd: any) => {
      commandItems.push({
        path: cmd.path,
        args: cmd.args
      });
    });

    const profile: ProfileItem = {
      name: item.name,
      description: item.description,
      status: item.status,
      users: item.users,
      commands: commandItems
    };

    // Exclude profiles that do not contain active user
    if (profile.users && profile.users.length) {
      if (!(username in profile.users)) {
        return;
      }
    }

    // Exclude profiles with no commands
    if (profile.commands.length == 0) {
      return;
    }

    profiles.push(profile);
  });

  return profiles;
}

/**
 * Method used to parse the config and return an array of
 * Departments which contain Groups which contain AppItems
 * @param filepath absolute path to the config
 */
export async function parseConfig(
  filepath: string,
  currentAppItems: AppItem[]
): Promise<{ appItems: AppItem[]; categories: Category[] }> {
  if (!fs.existsSync(filepath)) {
    return { appItems: [], categories: [] };
  }

  let obj;
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    obj = JSON.parse(content);
  } catch (err) {
    console.error(err);
    return { appItems: [], categories: [] };
  }

  if (!obj) {
    return { appItems: [], categories: [] };
  }

  // collect all app items
  const appItems: AppItem[] = [];
  let order = 0;
  const appBasePath: string = (await waitForIpc(
    'get-app-base',
    null,
    'set-app-base'
  )) as string;
  obj.forEach((item: any) => {
    if (!('profiles' in item) || !('uid' in item)) {
      return;
    }

    // collect profiles
    const profiles: ProfileItem[] = parseProfiles(item.profiles);
    if (!profiles || !profiles.length) {
      return;
    }

    appItems.push({
      uid: item.uid,
      category: item.category,
      profiles: profiles,
      icon: getAppIcon(item.icon, { configFilePath: filepath, appBasePath }),
      platforms: item.platforms,
      isHidden: false,
      selectedProfileId: 0,
      order
    });
    order++;
  });

  appItems.forEach(appItem => {
    const currentAppItem = currentAppItems.find(
      item => item && item.uid == appItem.uid
    );

    if (!currentAppItem) {
      return;
    }

    appItem.isHidden = currentAppItem.isHidden;
    appItem.order = currentAppItem.order;
    if (currentAppItem.selectedProfileId < appItem.profiles.length) {
      appItem.selectedProfileId = currentAppItem.selectedProfileId;
    }
  });

  // collect apps by category
  let categories: Category[] = [];
  appItems.forEach((item: AppItem) => {
    const cat = categories.find(obj => {
      return obj.name === item.category;
    });
    if (!cat) {
      categories.push({
        name: item.category,
        icon: 'mdi-apps'
      });
    }
  });

  return { appItems: appItems, categories: categories };
}

/**
 * Prompts user with dialog to select config file
 */
export function selectConfigFile(): string {
  const mainWindow = remote.getCurrentWindow();
  let filepaths = remote.dialog.showOpenDialogSync(mainWindow, {
    defaultPath: '/home',
    filters: [
      { name: 'All Files', extensions: ['*'] },
      { name: 'Filter Preset', extensions: ['json'] }
    ],
    properties: ['openFile']
  });

  if (!filepaths) {
    return '';
  }

  return filepaths[0];
}
