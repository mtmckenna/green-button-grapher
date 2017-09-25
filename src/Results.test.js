import React from 'react';
import ReactDOM from 'react-dom';
import Results from './Results';
import { shallow } from 'enzyme';
import CHART_TYPES from './chart-types';

describe('When there are power savings to show', function() {
  test('it shows the results', function() {
    const wrapper = shallow(<Results
      total={10}
      totalPeak={5}
      chartType={CHART_TYPES.POWER_USAGE}
      />);

    expect(wrapper.text()).toContain('Total: 10 kWh');
    expect(wrapper.text()).toContain('Peak: 5 kWh');

    wrapper.setProps({
      totalTheoretical: 8,
      totalPeakTheoretical: 1,
    });

    expect(wrapper.text()).toContain('Total: 10 kWh (2 kWh saved)');
    expect(wrapper.text()).toContain('Peak: 5 kWh (4 kWh saved)');
  });
});

describe('When there are dollar savings to show', function() {
  test('it shows the results', function() {
    const wrapper = shallow(<Results
      total={10}
      totalPeak={5}
      chartType={CHART_TYPES.COST}
      />);

    expect(wrapper.text()).toContain('Total: $10.00');
    expect(wrapper.text()).toContain('Peak: $5.00');

    wrapper.setProps({
      totalTheoretical: 8,
      totalPeakTheoretical: 1,
    });

    expect(wrapper.text()).toContain('Total: $10.00 ($2.00 saved)');
    expect(wrapper.text()).toContain('Peak: $5.00 ($4.00 saved)');
  });
});
