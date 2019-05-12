import React, { Component } from 'react';
import { WeatherClient, WeatherServer } from 'api';

import App from 'components/App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import Store from 'stores/Store';
import getPort from 'get-port';

let store = (window.store = new Store());

window.addEventListener('load', event => {
  if (process.env.NODE_ENV === 'development') {
    global.client = new WeatherClient('localhost', '3000');
    global.engineVersion = 'Dev-Mode';
    return;
  }

  (async () => {
    let enginePort = await getPort({
      host: '127.0.0.1',
      port: getPort.makeRange(3050, 3150),
    });

    if (global.server === undefined) {
      global.server = new WeatherServer(enginePort);
      global.client = new WeatherClient('localhost', enginePort);
      global.server.startEngine();

      global.engineVersion = await global.server.getVersion;
    }
  })();
});

window.addEventListener('unload', event => {
  global.server.stopEngine();
});

export default class Client extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
  }
}
