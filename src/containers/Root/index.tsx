import './index.css';
import * as React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Drawer from 'material-ui/Drawer';
import { List, ListItem } from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentSend from 'material-ui/svg-icons/content/send';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import Divider from 'material-ui/Divider';
import ActionInfo from 'material-ui/svg-icons/action/info';

@observer
export class Root extends React.Component<any, any> {
  @observable
  isOpened: boolean = false;

  @action
  toggleDrawer = () => {
    this.isOpened = !this.isOpened;
  }

  renderDevTool() {
    if (process.env.NODE_ENV !== 'production') {
      const DevTools = require('mobx-react-devtools').default;
      return (<DevTools />);
    } else {
      return undefined;
    }
  }

  render() {
    return (
      <div className="container">
        <AppBar onLeftIconButtonTouchTap={() => this.toggleDrawer()} />
        <div id="drawer">
          <Drawer docked={true} open={this.isOpened} disableSwipeToOpen={true} swipeAreaWidth={0} >
            <AppBar
              onLeftIconButtonTouchTap={() => this.toggleDrawer()}
            />
            <List>
              <ListItem primaryText="Inbox" leftIcon={<ContentInbox />} />
              <ListItem primaryText="Starred" leftIcon={<ActionGrade />} />
              <ListItem primaryText="Sent mail" leftIcon={<ContentSend />} />
              <ListItem primaryText="Drafts" leftIcon={<ContentDrafts />} />
              <ListItem primaryText="Inbox" leftIcon={<ContentInbox />} />
            </List>
            <Divider />
            <List>
              <ListItem primaryText="All mail" rightIcon={<ActionInfo />} />
              <ListItem primaryText="Trash" rightIcon={<ActionInfo />} />
              <ListItem primaryText="Spam" rightIcon={<ActionInfo />} />
              <ListItem primaryText="Follow up" rightIcon={<ActionInfo />} />
            </List>
          </Drawer>
        </div>
        <div id="children">
          <RaisedButton secondary={true} label="Default" onClick={() => alert('clicked')} />
          {this.props.children}
          {this.renderDevTool()}
        </div>
      </div>
    );
  }
}
