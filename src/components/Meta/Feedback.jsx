import React, { Component } from 'react';

class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedbackText: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.submitFeedback = this.submitFeedback.bind(this);
  }

  submitFeedback() {
    console.log('Submiting feedback to server.');
  }

  handleChange(event) {
    this.setState({ feedbackText: event.target.value });
  }

  render() {
    return (
      <div className="feedback">
        <textarea
          className="feedback-text"
          placeholder="Write your feedback & click Submit"
          value={this.state.feedbackText}
          onChange={this.handleChange}
        />
        <div className="btn btn-blue" onClick={this.submitFeedback}>
          Submit
        </div>
      </div>
    );
  }
}

export default Feedback;
