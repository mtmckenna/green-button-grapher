export default {
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    position: 'bottom'
  },
  animation: {
    duration: 0, // disable animations
  },
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true
      }
    }]
  },
  elements: {
    line: {
      tension: 0, // disabling bezier curves improves performance
    }
  }
};
