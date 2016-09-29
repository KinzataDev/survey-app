var React = require("react");
var $ = require('jquery');

var Router = require('react-router');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      email: ''
    }
  },

  handleLogin: function(e) {
    var email = this.state.email;

    console.log(email);

    $.ajax({
      url: "/login",
      dataType: 'json',
      type: 'POST',
      data: {email: email},
      success: function(data) {
        // redirect to survey section
        console.log("LOGGED IN");
        console.log(data);

        // This is not a proper solution, but I've spent an hour with no luck
        // getting react router to redirect successfully, moving on.
        window.location = "/#/survey";

      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
      }
    })
  },

  handleEmailChange: function(e) {
    this.setState({email: e.target.value});
  },

  render: function() {
    return (
      <form onSubmit={this.handleLogin}>
        <input
          type="text"
          placeholder="Email"
          defaultValue={this.state.email}
          onChange={this.handleEmailChange}
          className="form-control bottom-margin"
        />
      <input className="btn btn-default" type="submit" />
      </form>
    )
  }
});
