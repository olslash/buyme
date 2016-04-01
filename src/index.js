// POLYFILLS
import  "babel-core/register";
import "babel-polyfill";
import p from 'es6-promise';
p.polyfill();
import 'isomorphic-fetch';
// ---------

// STYLES
import './styles/styles.scss';
import './styles/simple-grid.css';
import 'react-virtualized/styles.css';
// ---------

import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import routes from './routes';
import configureStore from './store/configureStore';



const store = configureStore();

render(
  <Provider store={ store }>
    <Router history={ browserHistory } routes={ routes } />
  </Provider>, document.getElementById('app')
);
