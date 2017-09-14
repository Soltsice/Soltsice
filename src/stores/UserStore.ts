import { observable, computed, action } from 'mobx';
// import { Observable, Subject } from 'rxjs/Rx';
// import axios from 'axios';
import { UserManager, User, UserManagerSettings } from 'oidc-client'; // Log, MetadataService,

const localAuthority: boolean = false;

const settings: UserManagerSettings = {
    authority: localAuthority ? 'https://localhost:44333/i' : 'https://id.dbrain.io',
    client_id: 'dbrain_site',
    // redirect_uri: window.location.origin + '/auth.html',
    redirect_uri: window.location.origin + '/auth.html',
    popup_redirect_uri: window.location.origin + '/auth.html',
    silent_redirect_uri: window.location.origin + '/auth.silent.html',
    popupWindowFeatures: 'location=no,toolbar=no,width=600,height=600,left=100,top=100',
    post_logout_redirect_uri: window.location.origin,
    response_type: 'id_token token',
    scope: 'openid email roles profile api',
    automaticSilentRenew: true,
    // silentRequestTimeout:10000,
    filterProtocolClaims: true,
    loadUserInfo: true
};

export class UserStore {

    @observable
    user: User | null = null;

    @computed
    get name(): string {
        return this.user ? this.user.profile!.preferred_username! : '';
    }

    @computed
    get email(): string {
        return this.user ? this.user.profile.email : '';
    }

    @computed
    get isLoggedIn(): boolean {
        return this.user ? true : false;
    }

    @computed
    get isAdmin(): boolean {
        // TODO check claims
        return this.email === 'victor@dbrain.io';
    }

    @computed
    get accessToken(): string {
        return this.user ? this.user.access_token : '';
    }

    private userManager: UserManager;
    // private authHeaders: Headers;
    // private connected: Boolean;

    /**
     *
     */
    constructor() {
        console.log('UserStore ctor');
        this.userManager = new UserManager(settings);
        this.silentRequest();
        this.userManager.events.addUserUnloaded((e) => {
            console.log('user unloaded');
            this.setUser(null);
        });
        
        this.userManager.events.addAccessTokenExpired(() => {
            console.log('Event: addAccessTokenExpired');
        });

        this.userManager.events.addAccessTokenExpiring(() => {
            console.log('Event: addAccessTokenExpiring');
        });

        this.userManager.events.addSilentRenewError((args) => {
            console.log('Event: addSilentRenewError', args);
        });
    }

    // @action
    // public silentSyncRequest() {
    //     Observable.fromPromise(this.userManager.signinSilent())
    //         .take(1)
    //         .subscribe((user) => {
    //             console.log('Init user: ' + user['profile']['preferred_username']);
    //             this.connected = true;
    //             this._setAuthHeaders(user);
    //             this.store.dispatch(new authActions.UserLogin(new DBrainUser(user)));
    //         }, (err) => {
    //             console.log('err: ' + err);
    //             this.connected = false;
    //             this._setAuthHeaders(null);
    //             this.store.dispatch(new authActions.UserLogin(null));
    //         });
    // }

    @action
    public silentRequest() {
        this.userManager.signinSilent()
            .then((user) => {
                console.log('Init user: ' + user.profile.preferred_username);
                this._setAuthHeaders(user);
                this.setUser(user);

            })
            .catch((err) => {
                console.log('err: ' + err);
                this._setAuthHeaders(null);
                this.setUser(null);
            });
    }

    // public registerUser(model: SignupRequest): Observable<SignupResponse> {
    //     let headers = new Headers();
    //     headers.append('Content-Type', 'application/json');
    //     let options = new RequestOptions({ headers: headers });
    //     let body = JSON.stringify(model);
    //     console.log(body);
    //     let url = localAuthority
    //         ? 'https://localhost:44333/i/account/signup'
    //         : 'https://fi.im/i/account/signup';
    //     return this.http.post(url, body, options)
    //         .map(x => {
    //             console.log(x.json());
    //             return x.json() as SignupResponse;
    //         });
    // }

    public clearState() {
        let t = this;
        this.userManager.clearStaleState().then(function () {
            t.setUser(null);
            console.log('clearStateState success');
        }).catch(function (e: any) {
            console.log('clearStateState error', e.message);
        });
    }

    // public getUser() {
    //     this.userManager.getUser().then((user) => {
    //         console.log('got user', user);
    //         this._setAuthHeaders(user);
    //         this.store.dispatch(new authActions.UserLogin(new DBrainUser(user)));
    //     }).catch(function (err) {
    //         console.log(err);
    //     });
    // }

    // public removeUser() {
    //     this.userManager.removeUser().then(() => {
    //         this._setAuthHeaders(null);
    //         this.store.dispatch(new authActions.UserLogin(null));
    //         console.log('user removed');
    //     }).catch(function (err) {
    //         console.log(err);
    //     });
    // }

    public startSigninWindow() {
        this.userManager!.signinRedirect({ data: 'no data' }).then((user) => {
            console.log('signinRedirect done');
            this._setAuthHeaders(user);
            this.setUser(user);
        }).catch((err) => {
            console.log(err);
        });
    }

    public startSigninRedirect() {
        this.userManager!.signinRedirect({ data: 'some data' }).then((user) => {
            console.log('signinRedirect done');
            this._setAuthHeaders(user);
            this.setUser(user);
        }).catch(function (err: any) {
            console.log(err);
        });
    }

    // endSigninMainWindow() {
    //   this.userManager.signinRedirectCallback().then(function (user) {
    //     console.log('signed in', user);
    //   }).catch(function (err) {
    //     console.log(err);
    //   });
    // }

    public startSignoutWindow() {
        let th = this;
        this.userManager.signoutRedirect().then(function (resp: any) {
            console.log('signed out', resp);
            th._setAuthHeaders(null);
            th.setUser(null);
        }).catch((err) => {
            console.log(err);
        });
    }

    // endSignoutMainWindow() {
    //   this.userManager.signoutRedirectCallback().then(function (resp) {
    //     console.log('signed out', resp);
    //   }).catch(function (err) {
    //     console.log(err);
    //   });
    // };

    /**
     * Example of how you can make auth request using angulars http methods.
     * @param options if options are not supplied the default content type is application/json
     */
    // public AuthGet(url: string, options?: RequestOptions): Observable<Response> {

    //     if (options) {
    //         options = this._setRequestOptions(options);
    //     } else {
    //         options = this._setRequestOptions();
    //     }
    //     return this.http.get(url, options);
    // }

    // /**
    //  * @param options if options are not supplied the default content type is application/json
    //  */
    // public AuthPut(url: string, data: any, options?: RequestOptions): Observable<Response> {

    //     let body = JSON.stringify(data);

    //     if (options) {
    //         options = this._setRequestOptions(options);
    //     } else {
    //         options = this._setRequestOptions();
    //     }
    //     return this.http.put(url, body, options);
    // }
    // /**
    //  * @param options if options are not supplied the default content type is application/json
    //  */
    // public AuthDelete(url: string, options?: RequestOptions): Observable<Response> {

    //     if (options) {
    //         options = this._setRequestOptions(options);
    //     } else {
    //         options = this._setRequestOptions();
    //     }
    //     return this.http.delete(url, options);
    // }
    // /**
    //  * @param options if options are not supplied the default content type is application/json
    //  */
    // public AuthPost(url: string, data: any, options?: RequestOptions): Observable<Response> {

    //     let body = JSON.stringify(data);

    //     if (options) {
    //         options = this._setRequestOptions(options);
    //     }
    //     else {
    //         options = this._setRequestOptions();
    //     }
    //     return this.http.post(url, body, options);
    // }

    private _setAuthHeaders(user: any) {
        // this.authHeaders = new Headers();
        // if (user) {
        //     this.authHeaders.append('Authorization', user.token_type + ' ' + user.access_token);
        //     //alert('Authorization' + user.token_type + ' ' + user.access_token);
        //     this.authHeaders.append('Content-Type', 'application/json');
        // }
    }

    // private _setRequestOptions(options?: RequestOptions) {
    //     if (options) {
    //         options.headers.append(this.authHeaders.keys[0], this.authHeaders.values[0]);
    //     } else {
    //         options = new RequestOptions({ headers: this.authHeaders, body: '' });
    //     }
    //     return options;
    // }

    @action private setUser(user: User | null) {
        this.user = user;
    }

}

export default UserStore;