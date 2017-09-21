export * from './AppState';
export * from './RouterStore';
export * from './UserStore';

import { AppState } from './AppState';

import { createBrowserHistory } from 'history';
import { RouterStore } from './RouterStore';

import { UserStore } from './UserStore';

import { create } from 'mobx-persist';

const hydrate = create({ jsonify: true });

// prepare MobX stores
export const history = createBrowserHistory();

export const STORE_APP = 'AppState';
export const STORE_ROUTER = 'RouterStore';
export const STORE_USER = 'UserStore';

export const appState: AppState = new AppState();
export const routerStore: RouterStore = new RouterStore(history);
export const userStore: UserStore = new UserStore();

hydrate('user', userStore);
    // post hydration
    // .then(() => console.log('userStore hydrated'));

export const stores = {
    [STORE_APP]: appState,
    [STORE_ROUTER]: routerStore,
    [STORE_USER]: userStore
};
