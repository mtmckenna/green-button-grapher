import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import nightmare from 'nightmare'
require('nightmare-upload')(nightmare);
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import url from 'url'
import visit from '../helpers/visit'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

it('renders correctly', () => {
  const tree = renderer.create(
    <App />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

describe('When the app boots', function () {
  let server;
  beforeEach(function() { server = runStaticServer(); });
  afterEach(function() { server.close(); });

  test('it displays test data and can parse a new file', async function () {
    const SECOND_FILE_PATH = '/public/data/Mountain_Single_family_Jan_1_2011_to_Jan_1_2012.xml';
    const FULL_SECOND_FILE_PATH = `${process.cwd()}${SECOND_FILE_PATH}`;

    let page = visit('/index.html');

    let initialText = await page
      .wait(() => document.body.textContent.includes('123 SAMPLE ST BERKELEY CA 94707-2701'))
      .click("button[data-type='chart-type-cost']")
      .evaluate(() => document.body.textContent);

    expect(initialText).toContain('Total: $1.30');
    expect(initialText).toContain('Peak: $0.45');

    page.upload("input[type='file']", FULL_SECOND_FILE_PATH);

    let textAfterUpload = await page
      .wait(() => document.body.textContent.includes('Mountain Single-family'))
      .click("button[data-type='chart-type-power-usage']")
      .evaluate(() => document.body.textContent)
      .end();

    expect(textAfterUpload).toContain('Total: 24,380 kWh');
    expect(textAfterUpload).toContain('Peak: 5,339 kWh');
  });
});

describe('When loading a file', function() {
  test('it shows the loading screen', function() {
    const wrapper = shallow(<App />);
    wrapper.setState({ loading: false });
    expect(wrapper.text()).not.toContain('Loading');
    wrapper.setState({ loading: true });
    expect(wrapper.text()).toContain('Loading');
  });
});

function runStaticServer() {
  let express = require('express');
  let app = express();
  app.use(express.static('build'));
  return app.listen(3001);
}
