import React from 'react';
import ReactDOM from 'react-dom';
import Slider from './Slider';
import { shallow } from 'enzyme';
import CHART_TYPES from './chart-types';

describe('When the slider has been slid', function() {
  test('it shows the theoretical reduction', function() {
    const wrapper = shallow(<Slider multiplier={1} />);

    expect(wrapper.text()).not.toContain('Theoretical power use reduction');
    wrapper.setProps({multiplier: 0.9});
    expect(wrapper.text()).toContain('Theoretical power use reduction: 10%');

    wrapper.setProps({multiplier: 1.1});
    expect(wrapper.text()).toContain('Theoretical power use reduction: -10%');

  });
});
