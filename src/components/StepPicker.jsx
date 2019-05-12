import 'styles/steppicker';
import 'styles/tabview';
import 'styles/grid';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { Link } from 'react-router-dom';
import ReactSVG from 'react-svg';
import { steps as headerText } from 'static/HeaderText';
import inputFormats from 'static/InputFormats';

@inject('store')
@observer
class StepPicker extends Component {
  constructor(props) {
    super(props);
    this.fileUpload = React.createRef();

    this.getUploadedFileName = this.getUploadedFileName.bind(this);
    this.selectInput = this.selectInput.bind(this);
    this.goBack = this.goBack.bind(this);
    this.store = this.props.store;
  }

  getUploadedFileName(e) {
    const inputFile = e.target.files[0].path;
    const { tab, datalink } = this.props.match.params;

    switch (tab) {
      case 'decoder':
        this.store.demodulatedFile = inputFile;
        break;
      case 'processor':
        this.store.decodedFile = inputFile;
        break;
    }

    e.target.value = null;
    this.props.history.push(`/${tab}/${datalink}`);
  }

  selectInput(descriptor) {
    this.store.descriptor = descriptor;
    this.fileUpload.current.click();
  }

  handleTab(datalink, to) {
    this.props.history.push(`/steps/${datalink}/${to}`);
  }

  goBack() {
    this.props.history.push('/index.html');
  }

  render() {
    const { tab, datalink } = this.props.match.params;
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
        <div className="main-body step-picker">
          <div className="tab-view-header">
            <Link
              to={`/steps/${datalink}/recorder`}
              className={
                tab == 'recorder'
                  ? 'tab-view-tab tab-view-tab-selected'
                  : 'tab-view-tab'
              }
            >
              <ReactSVG src="/icons/radio.svg" />
              <h3>Recorder</h3>
            </Link>
            <Link
              to={`/steps/${datalink}/demodulator`}
              className={
                tab == 'demodulator'
                  ? 'tab-view-tab tab-view-tab-selected'
                  : 'tab-view-tab'
              }
            >
              <ReactSVG src="/icons/activity.svg" />
              <h3>Demodulator</h3>
            </Link>
            <Link
              to={`/steps/${datalink}/decoder`}
              className={
                tab == 'decoder'
                  ? 'tab-view-tab tab-view-tab-selected'
                  : 'tab-view-tab'
              }
            >
              <ReactSVG src="/icons/cpu.svg" />
              <h3>Decoder</h3>
            </Link>
            <Link
              to={`/steps/${datalink}/processor`}
              className={
                tab == 'processor'
                  ? 'tab-view-tab tab-view-tab-selected'
                  : 'tab-view-tab'
              }
            >
              <ReactSVG src="/icons/aperture.svg" />
              <h3>Processor</h3>
            </Link>
          </div>
          <div className="tab-view-body grid-container">
            {Object.entries(inputFormats[datalink][tab]).length == 0 ? (
              <div className="option-cell option-cell-disabled">
                <h3>No Options Yet</h3>
                <h4>
                  We're working hard to bring new features. They're coming soon!
                </h4>
              </div>
            ) : (
              Object.entries(inputFormats[datalink][tab]).map((o, i) => (
                <div key={i} className="option-cell">
                  <h3 onClick={() => this.selectInput(o[1].descriptor)}>
                    {o[1].title}
                  </h3>
                  <h4>{o[1].description}</h4>
                </div>
              ))
            )}
          </div>
        </div>
        <input
          type="file"
          ref={this.fileUpload}
          onInput={this.getUploadedFileName}
        />
      </div>
    );
  }
}

export default StepPicker;
