import * as React from 'react';
import { observer } from 'mobx-react';
import { AppState } from '../../stores';

@observer
export class TimerButton extends React.Component<{ appState: AppState }, {}> {
  render() {
    return (
      <div>
        <button onClick={this.onReset}>
          Seconds passed: {this.props.appState.timer}
        </button>
        {/* <DevTools /> */}
      </div>
    );
  }

  onReset = () => {
    this.props.appState.resetTimer();
  }
}
