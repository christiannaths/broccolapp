import React from 'react';
import Layout from './layout';
import Header from './header';

export default class Component extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      scripts: props.scripts || [],
    }
  }

  render(){

    const list = [
      'thing',
      'stuff',
      'other',
      'one',
      'foobar',
    ]

    const {
      scripts,
    } = this.state;

    return (
      <Layout>
        <body class="container">
          <Header />
          <p>Hello Fuck YEAHH</p>
          <ul className="my-list foo">
            { list.map( this._renderList ) }
          </ul>

          <button data-js="click">
            Click Me!
          </button>

          { scripts.map( this._renderScripts ) }
        </body>
      </Layout>
    );
  }

  _renderList(itemText, i){
    return <li key={ i }>{itemText}</li>;
  }

  _renderScripts(src){
    return <script src={ src }/>;
  }

  _handleClick(event){
    console.log('click', event)
  }
}
