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

  handleDeleteClicked: function(key) {
    var id = key;
    $.ajax({
      url: "/survey/" + id,
      type: "DELETE",
      success: function(res) {
        console.log(res.message);
        this.getSurveyData();
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
      }.bind(this)
    });
    return;
  },

  componentWillMount: function() {
    this.getSurveyData();
  },

  render: function() {
    var survey_list = [];
    var parent = this;
    this.state.surveys.map( function(row) {
      survey_list.push(
        <div className="row small-padding" key={row._id}>
          <div className="col-md-3">
            <label>{row.name}</label>
          </div>
          <div className="col-md-9">
            <Link className="btn btn-success right-margin" role="button" to={`/survey/${row._id}/take`}>Take Survey</Link>
            <Link className="btn btn-default right-margin" role="button" to={`/survey/${row._id}`}>Edit</Link>
            <Link className="btn btn-default right-margin" role="button" to={`/survey/${row._id}/results`}>Results</Link>
            <button className="btn btn-danger"onClick={parent.handleDeleteClicked.bind(parent, row._id)}>Remove</button>
          </div>
        </div>

      );
    });
    return (
      <div>
        <h2>Survey List</h2>
        <Link className="btn btn-default" role="button" to="/survey/create">Create new survey</Link>
        <br/><br/>
        <ul>
          {survey_list}
        </ul>
      </div>
    )
  }
});
