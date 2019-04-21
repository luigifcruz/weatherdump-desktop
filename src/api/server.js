import * as os from 'os';

import { version } from '../../package.json';

import path from 'path';
import { remote } from 'electron';
import request from 'superagent';
import { spawn } from 'child_process';

class WeatherServer {
  constructor(port) {
    this.dirname = remote.app.getAppPath();
    this.ver = null;
    this.port = port;
    this.cli = null;
  }

  get getState() {
    return this.cli !== null;
  }

  get getVersion() {
    return new Promise((resolve, reject) => {
      let runner = spawn(this.getBinaryPath(), ['--version']);

      runner.stderr.on('data', data => {
        resolve(data.toString());
      });
    });
  }

  getBinaryPath() {
    let binaryName = 'weatherdump';

    if (process.platform == 'win32') {
      binaryName.concat('.exe');
    }

    return path.join(this.dirname, '..', 'app', 'engine', binaryName);
  }

  startEngine() {
    let log = '';

    this.cli = spawn(this.getBinaryPath(), ['remote', this.port]);

    this.cli.stdout.on('data', data => {
      log += data.toString();
      console.log(data.toString());
    });

    this.cli.stderr.on('data', data => {
      log += data.toString();
      console.error(data.toString());

      if (this.cli != null) {
        this.cli = null;
        this.reportExit(log);
      }
    });
  }

  stopEngine() {
    if (!this.getState) {
      console.warn("Engine isn't running.");
      return;
    }

    this.cli.stdin.pause();
    this.cli.kill();
    this.cli = null;
  }

  reportExit(crash) {
    (async () => {
      request
        .post(`https://api.luigifreitas.me/report/crash`)
        .type('form')
        .send({
          platformArch: os.arch(),
          platformOs: os.platform(),
          systemCpusNumber: os.cpus().length,
          systemCpus: JSON.stringify(os.cpus()),
          systemMemory: os.totalmem(),
          timestamp: new Date().getTime(),
          versionCLI: await this.getVersion,
          versionGUI: version,
          crash,
        })
        .then(body => {
          console.log('Crash reported to server.');
        })
        .catch(() => {
          console.error('Crash reporting server error.');
        })
        .finally(() => {
          remote.dialog.showErrorBox(
            'Unexpected Engine Crash',
            'The WeatherDump engine has stopped working. This error was anonymously reported to our server. The app will now quit.'
          );
          if (global.debug !== true) {
            remote.app.quit();
          }
        });
    })();
  }
}

export default WeatherServer;
