import React, { Component } from 'react';
import './Slider.css';

export default class Slider extends Component {
  handleSliderMoved = (event) => {
    const multiplier = Number(event.currentTarget.value);
    this.props.handleSliderMoved(multiplier);
  }

  get powerUseReduction() {
    if (this.props.multiplier === 1.0) return null;
    return percentageFromMultiplier(this.props.multiplier);
  }

  render() {
    return (
      <div>
        <input className="slider" type="range"
          min="0" max="2" step="0.01" value={this.props.multiplier}
          onChange={this.handleSliderMoved}>
        </input>
        {this.powerUseReduction &&
          <div className="reduction-rate">
            Theoretical power use reduction: {this.powerUseReduction}
          </div>
        }
      </div>
    );
  }
}

function percentageFromMultiplier(multiplier) {
  let percentage = ((1.0 - multiplier) * 100).toFixed(0);
  return `${percentage}%`;
}
