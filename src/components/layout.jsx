import React from 'react';

import HtmlHead from './html-head';

export default class Component extends React.Component {
  constructor(props){
    super(props);
  }

  render(){

    const list = [
      'thing',
      'stuff',
      'other',
      'one',
      'foobar',
    ]

    return (
      <html>
        <HtmlHead/>
        { this.props.children }
      </html>
    );
  }

  _renderList(itemText, i){
    return <li key={ i }>{itemText}</li>;
  }

  _handleClick(event){
    console.log('click', event)
  }
}
