import React, { Component } from 'react';
import './Slider.css';

export default class Slider extends Component {
  constructor(props) {
    super(props);
    this.handleSliderMoved = this.handleSliderMoved.bind(this);
  }

  handleSliderMoved(event) {
    this.props.handleSliderMoved(event);
  }

  render() {
    return (
      <div>
        <input className="slider" type="range" onChange={this.handleSliderMoved}></input>
      </div>
    );
  }
}
