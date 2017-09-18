import React, { Component } from 'react';
import './Button.css';

export default class Button extends Component {
  get active() {
    return this.props.type === this.props.currentType;
  }

  get className() {
    let activeClass = this.active ? 'button--active' : '';
    return `button ${activeClass}`;
  }

  render() {
    return (
      <button
        className={this.className}
        data-type={this.props.type}
        onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}
