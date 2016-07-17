import React from 'react';
import Helmet from "react-helmet";
import DocumentMeta from 'react-document-meta';

export default class Component extends React.Component {
  constructor(props){
    super(props);
  }

  render(){

    return (
      <head>
        <title>Foobar | { this.props.title }</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script data-thing="stuff" src="http://www.google.ca" />
        <link rel="stylesheet" href="/assets/style.css" />
      </head>
    );
  }
}
