import './Logo.css';
import * as React from 'react';

// import logo = require('./Logo.png');
// import * as logo_white from './Logo_white.png';

export class Logo extends React.Component<{white: boolean}, {}> {
    render() {
      const src = this.props.white ? require('./Logo_white.svg') : require('./Logo.svg');
      return (
          <div >
              <img
                  src={src}
                  className="logo"
                  alt="DBrain"
              />
          </div>
      );
  }
}
