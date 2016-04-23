import test from './module';

export default class App extends React.Component {
  constructor(props){
    super(props)
  }

  render(){
    return (
      <div className="application-window">
        <blockquote>Hello {this.props.name }: from react and { test }</blockquote>
      </div>
    );
  }
}
