import React, { Component } from 'react';

export default class Results extends Component {
  get total() {
    return formattedDollarAmount(this.props.total);
  }

  get totalPeak() {
    return formattedDollarAmount(this.props.totalPeak);
  }

  get totalSaved() {
    return formattedDollarAmount(this.props.total - this.props.totalTheoretical);
  }

  get totalSavedPeak() {
    return formattedDollarAmount(this.props.totalPeak - this.props.totalPeakTheoretical);
  }

  render() {
    return (
      <div>
        <div>
          <div>Total: {this.total}</div>
          <div>Total peak: {this.totalPeak}</div>
        </div>
        <div>
          <div>Total saved: {this.totalSaved}</div>
          <div>Total saved peak: {this.totalSavedPeak}</div>
        </div>
      </div>
    );
  }
}

function formattedDollarAmount(number) {
  return '$' + formattedNumber(number);
}

function formattedNumber(number) {
  return number.toFixed(2);
}
