export * from './AppState';
export * from './RouterStore';

import { AppState } from './AppState';

import { createBrowserHistory } from 'history';
import { RouterStore } from './RouterStore';

// prepare MobX stores
export const history = createBrowserHistory();

export const STORE_APP = 'AppState';
export const STORE_ROUTER = 'RouterStore';

export const appState: AppState = new AppState();
export const routerStore: RouterStore = new RouterStore(history);

export const stores = {
    [STORE_APP]: appState,
    [STORE_ROUTER]: routerStore
};

// export default stores;
