import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.jsx';
import registerServiceWorker from './registerServiceWorker';
import ReactGA from 'react-ga';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

if (process.env.NODE_ENV === 'production') ReactGA.initialize(process.env.REACT_APP_GA_UA);

ReactGA.pageview(window.location.pathname + window.location.search);
