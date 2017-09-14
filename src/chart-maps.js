import CHART_TYPES from './chart-types';
import INTERVAL_TYPES from './interval-types';

const CHART_TYPE_TO_PROPERTY_MAP = {};

CHART_TYPE_TO_PROPERTY_MAP[CHART_TYPES.COST] = {
  dataType: 'cost',
  chartTitle: 'Cost of Power Over Time'
};

CHART_TYPE_TO_PROPERTY_MAP[CHART_TYPES.POWER_USAGE] = {
  dataType: 'value',
  chartTitle: 'Power Usage Over Time'
};

const INTERVAL_TYPE_TO_PROPERTY_MAP = {};

INTERVAL_TYPE_TO_PROPERTY_MAP[INTERVAL_TYPES.ACTUAL] = {
  backgroundColor: ['rgba(132, 0, 0, 1.0)'],
  borderColor: ['rgba(132, 0, 0, 1.0)'],
  titlePrefix: 'Actual'
};

INTERVAL_TYPE_TO_PROPERTY_MAP[INTERVAL_TYPES.THEORETICAL] = {
  backgroundColor: ['rgba(0, 0, 132, 1.0)'],
  borderColor: ['rgba(0, 0, 132, 1.0)'],
  titlePrefix: 'Theoretical'
};

export { CHART_TYPE_TO_PROPERTY_MAP, INTERVAL_TYPE_TO_PROPERTY_MAP };