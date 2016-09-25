var React = require("react");
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;

var $ = require('jquery');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      surveys: [],
    }
  },

  getSurveyData: function() {
    $.ajax({
      url: "/survey",
      dataType: "json",
      type: "GET",
      success: function(data) {
        console.log(data);
        this.setState({surveys: data.data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
      }.bind(this),
    })

    return;
  },

  componentWillMount: function() {
    this.getSurveyData();
  },

  render: function() {
    var survey_list = [];
    this.state.surveys.map( function(row) {
      survey_list.push(
        <div className="survey-listing" key={row.survey_id}>
          <label>{row.name}</label>
        </div>
      );
    });
    return (
      <div>
        <h2>Survey List</h2>
        <ul>
          {survey_list}
        </ul>
      </div>
    )
  }
});
