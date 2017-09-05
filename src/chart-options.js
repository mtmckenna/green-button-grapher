export default {
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true
      }
    }]
  },
  elements: {
    line: {
      tension: 0, // disables bezier curves
    }
  }
};
