import 'styles/meta';
import 'styles/tabview';

import { AnimatedSwitch, spring } from 'react-router-transition';
import { Link, Route } from 'react-router-dom';
import React, { Component } from 'react';

import About from './About';
import Advanced from './Advanced';
import Feedback from './Feedback';
import Licenses from './Licenses';
import ReactSVG from 'react-svg';
import Updates from './Updates';

function mapStyles(styles) {
  return {
    opacity: styles.opacity,
    transform: `scale(${styles.scale})`,
  };
}

function bounce(val) {
  return spring(val, {
    stiffness: 330,
    damping: 22,
  });
}

const bounceTransition = {
  atEnter: {
    opacity: 0,
    scale: 1.05,
  },
  atLeave: {
    opacity: bounce(0),
    scale: bounce(0.95),
  },
  atActive: {
    opacity: bounce(1),
    scale: bounce(1),
  },
};

class Meta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previous: props.location.state.previous,
    };
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    const { history } = this.props;
    history.push(this.state.previous);
  }

  render() {
    const { tab } = this.props.match.params;
    return (
      <div>
        <div className="main-header main-header-small">
          <h1 className="main-title">
            <ReactSVG
              onClick={this.handleClose}
              className="icon"
              src="/icons/x.svg"
            />
            WeatherDump
          </h1>
        </div>
        <div className="meta main-body main-body-large">
          <div className="tab-view-header">
            <Link
              to={`/meta/about`}
              className={
                tab == 'about'
                  ? 'tab-view-tab tab-view-tab-selected'
                  : 'tab-view-tab'
              }
            >
              <ReactSVG src="/icons/star.svg" />
              <h3>About</h3>
            </Link>
            <Link
              to={`/meta/feedback`}
              className={
                tab == 'feedback'
                  ? 'tab-view-tab tab-view-tab-selected'
                  : 'tab-view-tab'
              }
            >
              <ReactSVG src="/icons/heart.svg" />
              <h3>Feedback</h3>
            </Link>
            <Link
              to={`/meta/updates`}
              className={
                tab == 'updates'
                  ? 'tab-view-tab tab-view-tab-selected'
                  : 'tab-view-tab'
              }
            >
              <ReactSVG src="/icons/download-cloud.svg" />
              <h3>Updates</h3>
            </Link>
            <Link
              to={`/meta/licenses`}
              className={
                tab == 'licenses'
                  ? 'tab-view-tab tab-view-tab-selected'
                  : 'tab-view-tab'
              }
            >
              <ReactSVG src="/icons/pen-tool.svg" />
              <h3>Licenses</h3>
            </Link>
            <Link
              to={`/meta/advanced`}
              className={
                tab == 'advanced'
                  ? 'tab-view-tab tab-view-tab-selected'
                  : 'tab-view-tab'
              }
            >
              <ReactSVG src="/icons/terminal.svg" />
              <h3>Advanced</h3>
            </Link>
          </div>
          <AnimatedSwitch
            atEnter={bounceTransition.atEnter}
            atLeave={bounceTransition.atLeave}
            atActive={bounceTransition.atActive}
            mapStyles={mapStyles}
            className="tab-view-body"
          >
            <Route exact path="/meta/about" component={About} />
            <Route exact path="/meta/feedback" component={Feedback} />
            <Route exact path="/meta/updates" component={Updates} />
            <Route exact path="/meta/licenses" component={Licenses} />
            <Route exact path="/meta/advanced" component={Advanced} />
          </AnimatedSwitch>
        </div>
      </div>
    );
  }
}

export default Meta;
