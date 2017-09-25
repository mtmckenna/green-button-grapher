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
  backgroundColor: 'rgb(102,153,255)',
  borderColor: 'rgb(102,153,255)',
  titlePrefix: 'Actual'
};

INTERVAL_TYPE_TO_PROPERTY_MAP[INTERVAL_TYPES.THEORETICAL] = {
  backgroundColor: 'rgb(0, 0, 132)',
  borderColor: 'rgb(0, 0, 132)',
  titlePrefix: 'Theoretical'
};

export { CHART_TYPE_TO_PROPERTY_MAP, INTERVAL_TYPE_TO_PROPERTY_MAP };
