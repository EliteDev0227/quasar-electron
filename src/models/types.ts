export interface AppItem {
  // Loaded from category.json
  category: string;
  uid: string;
  profiles: ProfileItem[];
  icon: string;
  platforms: string[];

  // App-inner config
  selectedProfileId: number;
  order: number;
  isHidden: boolean;
}

export interface ProfileItem {
  name: string;
  description: string;
  status: string;
  users: string[];
  commands: CommandItem[];
}

export interface CommandItem {
  path: string;
  args: string;
}

export interface Category {
  name: string;
  icon: any | null;
}

export interface AppSettings {
  iconSize: number;
  configFilepath: string;
}

export interface FilterState {
  searchQuery?: string;
  showHidden?: boolean | null;
};

export interface AppState {
  isBusy: boolean;
  categories: Category[];
  appItems: AppItem[];
  settings: AppSettings;
  filters: FilterState;
}
