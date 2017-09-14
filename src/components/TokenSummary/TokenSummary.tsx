// import * as React from 'react';
// import { observer, inject } from 'mobx-react';
// import { isProduction } from '../../constants';
// import * as stores from '../../stores';
// import { TimerButton } from '../TimerButton';
// import { Route, RouteComponentProps } from 'react-router';
// import { Link, match } from 'react-router-dom';

// const logo = require('./logo.svg');

// interface Props {
//   foo: string;
//   match?: match<any>;
//   AppState?: stores.AppState;
// }

// @observer
// class MyComponent extends React.Component<Props, {}> {
//   render() {
//     return <span>{this.props.foo}</span>;
//   }
// }

// @inject(stores.STORE_USER)
// @observer
// export class App extends React.Component<Props> {

//   private userStore = this.props[stores.STORE_USER] as stores.UserStore;

//   // startSigninWindow() {

//   //   console.log('PROPS: ', this.props);

//   //   let userStore = this.props[stores.STORE_USER] as stores.UserStore;

//   //   console.log('USER: ', userStore.user);
//   //   console.log('userStore: ', userStore);
//   //   userStore.startSigninWindow();
//   // }

//   render() {
//     console.log('PROPS: ', this.props);
//     console.log('USER: ', this.userStore.user);
//     console.log('userStore: ', this.userStore);
//     let m = this.props.match!;
//     return (
//       <div className="App">
//         <div className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <h2>Welcome to React!</h2>
//         </div>
//         <button onClick={() => this.userStore.startSigninWindow()}>
//           {this.userStore.isLoggedIn ? <span>Logout </span> : <span>Login</span>}
//         </button>
//         <p className="App-intro">
//           To get started, edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <div>
//           <TimerButton appState={stores.appState} />
//         </div>
//         <h1>Prod: {String(isProduction)}</h1>
//         <div>
//           <MyComponent foo={this.props.foo} />
//         </div>

//         <h2>Topics</h2>
//         <ul>
//           <li>
//             <Link to={`${m.url}/rendering`}>
//               Rendering with React
//         </Link>
//           </li>
//           <li>
//             <Link to={`${m.url}/components`}>
//               Components
//         </Link>
//           </li>
//           <li>
//             <Link to={`${m.url}/props-v-state`}>
//               Props v. State
//         </Link>
//           </li>
//         </ul>
//         <Route
//           path={`${m.url}/:topicId`}
//           component={Topic}
//         />
//         <Route
//           exact={true}
//           path={m.url}
//           render={() => (
//             <h3>No topic {JSON.stringify(m)}</h3>
//           )}
//         />
//       </div>

//     );
//   }
// }

// @inject(stores.STORE_APP)
// @observer
// class Topic extends React.Component<RouteComponentProps<any>> {
//   render() {
//     return (
//       <div>
//         <h3>{this.props.match!.params.topicId}</h3>
//         <h4>Seconds passed: {(this.props[stores.STORE_APP] as stores.AppState).timer}</h4>
//         <p>{JSON.stringify(this.props)}</p>
//       </div>
//     );
//   }
// }

// export default App;
