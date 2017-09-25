import React from 'react';
import ReactDOM from 'react-dom';
import Button from './Button';
import { shallow } from 'enzyme';

describe('When the button type is the currently selected type', function() {
  test('it is active', function() {
    const wrapper = shallow(<Button type='cat' currentType='dog' />);
    let button = wrapper.instance();
    expect(button.active).toBeFalsy();
    wrapper.setProps({currentType: 'cat'});
    expect(button.active).toBeTruthy();
  });
});

describe('When active', function() {
  test('it has the active class', function() {
    const wrapper = shallow(<Button type='cat' currentType='dog' />);
    let button = wrapper.instance();
    expect(button.className).toEqual('button ');
    wrapper.setProps({currentType: 'cat'});
    expect(button.className).toEqual('button button--active');
  });
});
