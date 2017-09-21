import './LoginButton.css';
import * as React from 'react';
import { observer, inject } from 'mobx-react';
import * as stores from '../../stores';

@inject(stores.STORE_USER)
@observer
export class LoginButton extends React.Component<{}, {}> {
    private userStore = this.props[stores.STORE_USER] as stores.UserStore;
    render() {
        return (
            <div >
                <button
                    onClick={() => this.userStore.isLoggedIn
                        ? this.userStore.startSignoutWindow() : this.userStore.startSigninRedirect()}
                >
                    {this.userStore.isLoggedIn ? <span>Logout </span> : <span>Login</span>}
                </button>
            </div>
        );
    }
}
