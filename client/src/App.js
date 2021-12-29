import React, { Component } from 'react';
import './index.css';
import YearForm from './YearForm';
import Events from './Events';

class App extends Component {
  constructor(props) {
    super(props);

    let randomYear = Math.round(Math.random() * 2000 * (Math.random() > 0.5 ? 1 : -1));
    this.state = {
      year: randomYear,
      events: ["", ""]
    };

    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.generate = this.generate.bind(this);
  }

  componentDidMount() {
    this.generate();
  }

  render() {
    return (
      <div className="App">
        <header>
          <h1>Horizontal History</h1>

          <p>Enter a non-zero year (positive for AD/CE, negative for BC/BCE).</p>

          <YearForm
            year={this.state.year}
            handleInput={this.handleInput}
            handleSubmit={this.handleSubmit} />
        </header>
      
        <Events
          year={this.state.year}
          events={this.state.events} />
      </div>
    );
  }

  handleInput(e) {
    e.preventDefault();
    this.setState({
      year: e.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.generate();
  }

  generate() {
    fetch("/api/" + this.state.year)
      .then(res => res.json())
      .then(events => this.setState({
        events: events
      }));
  }
}

export default App;
