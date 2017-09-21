import * as React from 'react';
import { observer, inject } from 'mobx-react';
import * as stores from '../../stores';
import { Link } from 'react-router-dom';

@inject(stores.STORE_USER, stores.STORE_ROUTER)
@observer
export class AuthHtml extends React.Component<{}, {}> {
    private userStore = this.props[stores.STORE_USER] as stores.UserStore;
    private routerStore = this.props[stores.STORE_ROUTER] as stores.RouterStore;
    render() {
        console.log('Rendering auth.html from React');
        this.userStore.userManager.signinRedirectCallback().then(user => {
            if (user === null) {
                document.getElementById('waiting')!.style.display = 'none';
                document.getElementById('error')!.innerText = 'No sign-in request pending.';
            } else {
                this.userStore.setUser(user);
                this.routerStore.history!.push('/');
            }
            
        });
        return (
            <div>
                <h1 id="waiting">Waiting...</h1>
                <div id="error" />
                <Link to={`/`}> Home</Link>
            </div>
        );
    }
}

@inject(stores.STORE_USER, stores.STORE_ROUTER)
@observer
export class AuthHtmlSilent extends React.Component<{}, {}> {
    private userStore = this.props[stores.STORE_USER] as stores.UserStore;
    render() {
        console.log('Rendering auth.silent.html from React');
        this.userStore.userManager.signinSilentCallback();
        return (
            <div>
                <h1 id="waiting">Waiting...</h1>
                <div id="error" />
            </div>
        );
    }
}
