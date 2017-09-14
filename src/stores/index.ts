export * from './AppState';
export * from './RouterStore';
export * from './UserStore';

import { AppState } from './AppState';

import { createBrowserHistory } from 'history';
import { RouterStore } from './RouterStore';
import { UserStore } from './UserStore';

// prepare MobX stores
export const history = createBrowserHistory();

export const STORE_APP = 'AppState';
export const STORE_ROUTER = 'RouterStore';
export const STORE_USER = 'UserStore';

export const appState: AppState = new AppState();
export const routerStore: RouterStore = new RouterStore(history);
export const userStore: UserStore = new UserStore();

export const stores = {
    [STORE_APP]: appState,
    [STORE_ROUTER]: routerStore,
    [STORE_USER]: userStore
};
