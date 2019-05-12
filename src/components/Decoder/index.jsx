import 'styles/Decoder';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import Constellation from './Constellation';
import ReactSVG from 'react-svg';
import { RingLoader } from 'react-spinners';
import Websocket from 'react-websocket';
import { decoder as headerText } from 'static/HeaderText';

@inject('store')
@observer
class Decoder extends Component {
  constructor(props) {
    super(props);

    this.handleAbort = this.handleAbort.bind(this);
    this.openDecodedFolder = this.openDecodedFolder.bind(this);
    this.openProcessor = this.openProcessor.bind(this);
    this.handleSocketEvent = this.handleSocketEvent.bind(this);
    this.handleSocketMessage = this.handleSocketMessage.bind(this);
    this.datalink = this.props.match.params.datalink;

    this.store = this.props.store;
    this.decoder = this.props.store.decoder;
  }

  handleSocketMessage(payload) {
    this.decoder.parsePayload(payload);
    if (this.decoder.stats.Finished) {
      this.handleFinish();
    }
  }

  handleSocketEvent() {
    this.decoder.socketOpen = !this.decoder.socketOpen;
  }

  componentDidMount() {
    if (this.store.id == null) {
      this.store.startDecoder(this.datalink);
    }
  }

  handleFinish() {
    if (!document.hasFocus()) {
      new Notification('Decoder Finished', {
        body: 'WeatherDump finished decoding your file.',
      });
    }
    this.store.reset();
  }

  handleAbort() {
    const uri = `/steps/${this.datalink}/decoder`;
    this.props.history.push(uri);

    this.store.abortDecoder().then(() => {
      this.handleFinish();
    });
  }

  openDecodedFolder() {
    let filePath = this.store.decodedFile.split('/');
    filePath.pop();
    window.open(filePath.join('/'), '_blank');
  }

  openProcessor() {
    this.props.history.push(`/processor/${this.datalink}`);
  }

  render() {
    const { stats } = this.decoder;

    let percentage = (stats.TotalBytesRead / stats.TotalBytes) * 100;
    percentage = isNaN(percentage) ? 0 : percentage;

    let droppedpackets = (stats.DroppedPackets / stats.TotalPackets) * 100;
    droppedpackets = isNaN(droppedpackets) ? 0 : droppedpackets;

    return (
      <div>
        <div className="main-header">
          <h1 className="main-title">
            <ReactSVG
              onClick={this.handleAbort}
              className="icon"
              src="/icons/arrow-left.svg"
            />
            {headerText.title}
          </h1>
          <h2 className="main-description">{headerText.description}</h2>
        </div>
        {this.store.id != null ? (
          <div>
            <Websocket
              reconnect={true}
              debug={process.env.NODE_ENV == 'development'}
              url={`ws://${global.client.enginePath}/socket/${this.datalink}/${
                this.store.id
              }`}
              onMessage={this.handleSocketMessage}
              onOpen={this.handleSocketEvent}
              onClose={this.handleSocketEvent}
            />
          </div>
        ) : null}
        {this.decoder.socketOpen || this.decoder.stats.Finished || false ? (
          <div className="main-body Decoder">
            <div className="LeftWindow">
              <Constellation
                percentage={percentage}
                stats={this.decoder.stats}
                complex={this.decoder.complex}
              />
            </div>
            <div className="CenterWindow">
              <div className="ReedSolomon">
                <div className="Indicator">
                  <div className="Block">
                    <div className="Corrections">
                      {stats.AverageRSCorrections[0]}
                    </div>
                    <div className="Label">B01</div>
                  </div>
                  <div className="Block">
                    <div className="Corrections">
                      {stats.AverageRSCorrections[1]}
                    </div>
                    <div className="Label">B02</div>
                  </div>
                  <div className="Block">
                    <div className="Corrections">
                      {stats.AverageRSCorrections[2]}
                    </div>
                    <div className="Label">B03</div>
                  </div>
                  <div className="Block">
                    <div className="Corrections">
                      {stats.AverageRSCorrections[3]}
                    </div>
                    <div className="Label">B04</div>
                  </div>
                </div>
                <div className="Name">Reed-Solomon Corrections</div>
              </div>
              <div className="SignalQuality">
                <div className="Number">{stats.SignalQuality}%</div>
                <div className="Name">Signal Quality</div>
              </div>
              <div className="DroppedPackets">
                <div className="Number">{droppedpackets.toFixed(2)}%</div>
                <div className="Name">Dropped Packets</div>
              </div>
              <div className="SignalQuality">
                <div className="Number">{stats.FrameLock ? stats.VCID : 0}</div>
                <div className="Name">VCID</div>
              </div>
              <div className="DroppedPackets">
                <div className="Number">
                  {stats.AverageVitCorrections}/{stats.FrameBits}
                </div>
                <div className="Name">Viterbi Errors</div>
              </div>
              <div
                className="LockIndicator"
                style={{ background: stats.FrameLock ? '#00BA8C' : '#282A37' }}
              >
                {stats.FrameLock ? 'LOCKED' : 'UNLOCKED'}
              </div>
            </div>
            <div className="RightWindow">
              <div className="ChannelList">
                <div className="Label">Received Packets per Channel</div>
                {stats.ReceivedPacketsPerChannel.map((received, i) => {
                  if (received > 0) {
                    return (
                      <div key={i} className="Channel">
                        <div className="VCID">{i}</div>
                        <div className="Count">{received}</div>
                      </div>
                    );
                  }
                })}
              </div>
              <div className="controll-box">
                {this.store.id != null && this.store.decodedFile != null ? (
                  <div
                    onClick={this.handleAbort}
                    className="btn btn-orange btn-large"
                  >
                    Abort Decoding
                  </div>
                ) : (
                  <div>
                    <div
                      onClick={this.openDecodedFolder}
                      className="btn btn-blue btn-small btn-left"
                    >
                      Open Folder
                    </div>
                    <div
                      onClick={this.openProcessor}
                      className="btn btn-green btn-small"
                    >
                      Next Step
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="sockets-loader">
            <RingLoader sizeUnit={'px'} size={100} color={'#63667B'} />
          </div>
        )}
      </div>
    );
  }
}

export default Decoder;
