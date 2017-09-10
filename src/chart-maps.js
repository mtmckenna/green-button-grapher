import chartTypes from './chart-types';
import intervalTypes from './interval-types';

const CHART_TYPE_TO_PROPERTY_MAP = {};

CHART_TYPE_TO_PROPERTY_MAP[chartTypes.COST] = {
  dataType: 'cost',
  chartTitle: 'Cost of Power Over Time'
};

CHART_TYPE_TO_PROPERTY_MAP[chartTypes.POWER_USAGE] = {
  dataType: 'value',
  chartTitle: 'Power Usage Over Time'
};

const INTERVAL_TYPE_TO_PROPERTY_MAP = {};

INTERVAL_TYPE_TO_PROPERTY_MAP[intervalTypes.ACTUAL] = {
  backgroundColor: ['rgba(132, 0, 0, 1.0)'],
  borderColor: ['rgba(132, 0, 0, 1.0)'],
  titlePrefix: 'Actual'
};

INTERVAL_TYPE_TO_PROPERTY_MAP[intervalTypes.THEORETICAL] = {
  backgroundColor: ['rgba(0, 0, 132, 1.0)'],
  borderColor: ['rgba(0, 0, 132, 1.0)'],
  titlePrefix: 'Theoretical'
};

export { CHART_TYPE_TO_PROPERTY_MAP, INTERVAL_TYPE_TO_PROPERTY_MAP };
