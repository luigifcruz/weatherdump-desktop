import { action, computed, observable } from 'mobx';

export default class DecoderStore {
  @observable complex = [];
  @observable sockerOpen = false;
  @observable stats = {
    TotalBytesRead: 0.0,
    TotalBytes: 0.0,
    AverageRSCorrections: [-1, -1, -1, -1],
    AverageVitCorrections: 0,
    SignalQuality: 0,
    ReceivedPacketsPerChannel: [],
    Finished: false,
    TaskName: 'Starting decoder',
  };

  @action parseComplex() {
    const base64 = this.stats.Constellation;
    const wordArray = window.atob(base64);
    let len = wordArray.length,
      u8_array = new Uint8Array(len),
      offset = 0,
      word,
      i;
    for (i = 0; i < len; i++) {
      word = wordArray.charCodeAt(i);
      u8_array[offset++] = word & 0xff;
    }
    this.complex = u8_array;
  }

  @action parsePayload(payload) {
    this.stats = JSON.parse(payload);
    this.parseComplex();
  }
}
