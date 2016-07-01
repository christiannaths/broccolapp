class ExampleComponent {
  constructor(message){
    this.message = message;
  }

  logToConsole(){
    console.log(this.message)
  }
}

const exampleComponent = new ExampleComponent('Hello World');
exampleComponent.logToConsole();

export default exampleComponent;
