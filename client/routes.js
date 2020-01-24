import React, {Component} from 'react';

import Welcome from './components/welcome';

// function or class component? decide later...
class Routes extends Component {
  constructor () {
    super();
  }

  render () {
    if (!this.props.game) {
      return (
        <Welcome />
      );
    } else {
      return (
        <div>
          IN GAME LOL
        </div>
      );
    }
  }
}

export default Routes;