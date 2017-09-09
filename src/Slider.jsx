import React, { Component } from 'react';
import './Slider.css';

export default class Slider extends Component {
  handleSliderMoved = (event) => {
    this.props.handleSliderMoved(event);
  }

  render() {
    return (
      <div>
        <input className="slider" type="range"
          min="0" max="2" step="0.01" value={this.props.multiplier}
          onChange={this.handleSliderMoved}>
        </input>
      </div>
    );
  }
}
