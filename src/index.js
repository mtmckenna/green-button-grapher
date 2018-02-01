import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.jsx';
import registerServiceWorker from './registerServiceWorker';
import ReactGA from 'react-ga';
import bugsnag from 'bugsnag-js'
import bugsnagReact from 'bugsnag-react'

const bugsnagClient = bugsnag({
  apiKey: process.env.REACT_APP_BUGSNAG_KEY || 'no-key',
  notifyReleaseStages: ['production']
});

const ErrorBoundary = bugsnagClient.use(bugsnagReact(React))

ReactDOM.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  document.getElementById('root')
);

registerServiceWorker();

if (process.env.NODE_ENV === 'production') ReactGA.initialize(process.env.REACT_APP_GA_UA);
ReactGA.pageview(window.location.pathname + window.location.search);
