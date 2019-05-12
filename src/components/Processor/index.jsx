import 'styles/processor';
import 'styles/matrix';
import 'styles/btn';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import ListItem from './ListItem';
import MatrixItem from './MatrixItem';
import ReactSVG from 'react-svg';
import { processor as headerText } from 'static/HeaderText';

@inject('store')
@observer
class Processor extends Component {
  constructor(props) {
    super(props);

    this.goBack = this.goBack.bind(this);
    this.startProcessor = this.startProcessor.bind(this);
    this.datalink = this.props.match.params.datalink;

    this.store = this.props.store;
    this.processor = this.props.store.processor;
  }

  componentDidMount() {
    this.processor.fetchManifest(this.datalink);
  }

  startProcessor() {
    this.store.startProcessor(this.datalink).then(() => {
      this.props.history.push(`/showroom/${this.datalink}`);
    });
  }

  goBack() {
    this.store.abortProcessor().then(() => {
      this.props.history.push('/index.html');
    });
  }

  render() {
    return (
      <div>
        <div className="main-header">
          <h1 className="main-title">
            <ReactSVG
              onClick={this.goBack}
              className="icon"
              src="/icons/arrow-left.svg"
            />
            {headerText.title}
          </h1>
          <h2 className="main-description">{headerText.description}</h2>
        </div>
        <div className="main-body mtx-container processor processor-dark">
          <div className="mtx-block mtx-block-large">
            <div className="mtx-block-name">Individual Bands</div>
            <div className="mtx-container mtx-flex">
              {Object.entries(this.processor.parser).map((p, i) => {
                const cell = this.processor.parser[p[0]];
                return <MatrixItem key={i} cell={cell} />;
              })}
            </div>
          </div>
          <div className="mtx-block mtx-block-large">
            <div className="mtx-block-name">Multispectral Composites</div>
            <div className="mtx-container mtx-flex">
              {Object.entries(this.processor.composer).map((p, i) => {
                const cell = this.processor.composer[p[0]];
                return <MatrixItem key={i} cell={cell} />;
              })}
            </div>
          </div>
          <div className="mtx-block mtx-block-medium">
            <div className="mtx-block-name">Image Enhancement</div>
            <div className="mtx-container ch-list-dark">
              {Object.entries(this.processor.enhancements).map((p, i) => {
                const cell = this.processor.enhancements[p[0]];
                if (!p[0].includes('Export')) {
                  return <ListItem key={i} cell={cell} />;
                }
              })}
            </div>
          </div>
          <div className="mtx-block mtx-block-medium">
            <div className="mtx-block-name">Overlay Options</div>
          </div>
          <div className="mtx-block mtx-block-medium">
            <div className="mtx-block-name">Export Format</div>
            <div className="mtx-container ch-list-dark">
              {Object.entries(this.processor.enhancements).map((p, i) => {
                const cell = this.processor.enhancements[p[0]];
                if (p[0].includes('Export')) {
                  return <ListItem key={i} cell={cell} />;
                }
              })}
            </div>
          </div>
          <div
            onClick={this.startProcessor}
            className="mtx-block-small btn btn-flex btn-blue"
          >
            <ReactSVG src="/icons/play.svg" />
          </div>
        </div>
      </div>
    );
  }
}

export default Processor;
