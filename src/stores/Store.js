import { action, observable } from 'mobx';

import DecoderStore from 'stores/DecoderStore';
import ProcessorStore from 'stores/ProcessorStore';

export default class Store {
  @observable id = null;
  @observable descriptor = null;
  @observable decodedFile = null;
  @observable demodulatedFile = null;
  @observable workingPath = null;

  @observable processor = new ProcessorStore();
  @observable decoder = new DecoderStore();

  @action reset() {
    this.id = null;
  }

  // Processor Methods

  @action startProcessor(datalink) {
    return global.client
      .startProcessor({
        datalink,
        inputPath: this.decodedFile,
        pipeline: this.processor.enhancementsString,
        manifest: this.processor.manifestString,
      })
      .then(res => {
        this.id = res.uuid;
        this.demodulatedFile = res.outputPath;
      });
  }

  @action abortProcessor() {
    return new Promise((resolve, reject) => {
      resolve();
      // To-do: ADD PROCESSOR ABORT WHEN AVAILABLE
      this.id = null;
    });
  }

  // Decoder Methods

  @action startDecoder(datalink) {
    return global.client
      .startDecoder({
        datalink,
        inputFile: this.demodulatedFile,
        decoder: this.descriptor,
      })
      .then(res => {
        this.id = res.uuid;
        this.decodedFile = res.outputPath;
      });
  }

  @action abortDecoder() {
    return global.client.abortTask(this.id);
  }
}
