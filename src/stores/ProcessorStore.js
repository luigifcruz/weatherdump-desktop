import { action, computed, observable } from 'mobx';

export default class ProcessorStore {
  @observable parser = {};
  @observable composer = {};
  @observable enhancements = {
    Invert: {
      Name: 'Invert Infrared Pixels',
      Activated: true,
    },
    Flop: {
      Name: 'Horizontally Flip Image',
      Activated: false,
    },
    Equalize: {
      Name: 'Histogram Equalization',
      Activated: true,
    },
    ExportPNG: {
      Name: 'Lossless PNG',
      Activated: false,
    },
    ExportJPEG: {
      Name: 'Lossless JPEG',
      Activated: true,
    },
  };

  @computed get manifestString() {
    return JSON.stringify({
      Parser: this.parser,
      Composer: this.composer,
    });
  }

  @computed get manifestMerged() {
    return { ...this.composer, ...this.parser };
  }

  @computed get enhancementsString() {
    return JSON.stringify(this.enhancements);
  }

  @action updateManifest(payload) {
    this.parser = payload.Parser;
    this.composer = payload.Composer;
  }

  @action fetchManifest(datalink) {
    global.client.getManifest(datalink).then(manifest => {
      this.parser = manifest.Parser;
      this.composer = manifest.Composer;
    });
  }
}
