import 'styles/showroom';
import 'styles/progressbar';
import 'styles/btn';
import 'styles/grid';
import 'styles/scrollbar';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import ReactSVG from 'react-svg';
import Websocket from 'react-websocket';
import { showroom as headerText } from 'static/HeaderText';
import open from 'open';

@inject('store')
@observer
class Showroom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socketOpen: false,
    };

    this.openDecodedFolder = this.openDecodedFolder.bind(this);
    this.openDecodedFile = this.openDecodedFile.bind(this);
    this.decodedFilePath = this.decodedFilePath.bind(this);
    this.handleSocketMessage = this.handleSocketMessage.bind(this);
    this.handleSocketEvent = this.handleSocketEvent.bind(this);
    this.handleAbort = this.handleAbort.bind(this);

    this.store = this.props.store;
    this.processor = this.props.store.processor;
  }

  decodedFilePath(path) {
    let ext = '.jpeg';
    if (!this.processor.enhancements.ExportJPEG.Activated) {
      ext = '.png';
    }
    return path + ext;
  }

  openDecodedFile(path) {
    (async () => {
      await open(this.decodedFilePath(path), { wait: true });
    })();
  }

  openDecodedFolder() {
    (async () => {
      await open(this.store.demodulatedFile, { wait: true });
    })();
  }

  handleAbort() {
    this.store.abortProcessor().then(() => {
      this.props.history.push('/index.html');
    });
  }

  handleFinish() {
    if (!document.hasFocus()) {
      new Notification('Processing Finished', {
        body: 'WeatherDump finished processing your file.',
      });
    }
    this.store.reset();
  }

  handleSocketMessage(payload) {
    this.processor.updateManifest(JSON.parse(payload));
  }

  handleSocketEvent() {
    this.setState({ socketOpen: !this.state.socketOpen });
  }

  render() {
    const { datalink } = this.props.match.params;
    const { manifestMerged } = this.processor;

    let count = 0,
      finished = 0;

    Object.entries(manifestMerged).map((p, i) => {
      if (p[1].Finished) {
        finished++;
      }
      count++;
    });

    const ratio = (finished / count) * 100;

    return (
      <div>
        {this.store.id != null ? (
          <div>
            <Websocket
              reconnect={true}
              debug={true}
              url={`ws://${global.client.enginePath}/socket/${datalink}/${
                this.store.id
              }`}
              onMessage={this.handleSocketMessage}
              onOpen={this.handleSocketEvent}
              onClose={this.handleSocketEvent}
            />
          </div>
        ) : null}
        <div className="main-header">
          <h1 className="main-title">
            <ReactSVG
              onClick={this.handleAbort}
              className="icon"
              src="/icons/x.svg"
            />
            {headerText.title}
          </h1>
          <h2 className="main-description">{headerText.description}</h2>
        </div>
        <div className="main-body showroom">
          <div className="products grid-container scroll-bar">
            {Object.entries(manifestMerged).map((p, i) => {
              const { Filename, Finished, Name, Description } = p[1];
              const filePath = this.decodedFilePath(Filename);

              if (Finished && Filename != '') {
                return (
                  <div
                    key={i}
                    onClick={() => this.openDecodedFile(Filename)}
                    className="product product-dark"
                  >
                    <div className="img">
                      <img
                        src={`http://${
                          global.client.enginePath
                        }/get/thumbnail?filepath=${filePath}`}
                      />
                    </div>
                    <div className="title">{Name}</div>
                    <div className="description">{Description}</div>
                  </div>
                );
              }
            })}
          </div>
          <div className="controller">
            <div className="progress-bar progress-bar-green-dark">
              <div className="bar">
                <div
                  style={{ background: '#059C75', width: ratio + '%' }}
                  className="filler"
                />
              </div>
              <div className="text">
                <div className="description">Processing packets</div>
                <div className="percentage">
                  {finished}/{count} {ratio.toFixed(0)}%
                </div>
              </div>
            </div>
            <div onClick={this.openDecodedFolder} className="btn btn-orange">
              Open Folder
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Showroom;
