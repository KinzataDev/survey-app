var React = require("react");
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;

var $ = require('jquery');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      _id: this.props.params.id,
      name: '',
      questions: [],
      results: []
    }
  },

  getSurveyData: function() {
    $.ajax({
      url: "/survey/" + this.state._id,
      dataType: "json",
      type: "GET",
      success: function(data) {
        console.log(data);
        if( this.state.initial_name == '') {
          this.setState({initial_name: data.data.name})
        }
        this.setState({name: data.data.name});
        this.setState({questions: data.data.questions});
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
      }.bind(this),
    })

    return;
  },

  getResultsData: function() {
    $.ajax({
      url: "/survey/" + this.state._id + "/results",
      dataType: "json",
      type: "GET",
      success: function(data) {
        console.log(data);
        this.setState({results: data.data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
      }.bind(this),
    })

    return;
  },

  componentDidMount: function() {
    this.getSurveyData();
    this.getResultsData();
  },

  render: function() {

    var question_list = [];
    var results_obj = {};
    var index = 0;
    var parent = this;

    this.state.results.map(function(result) {
      var id = result.question_id;
      if( results_obj[id] ) {
        results_obj[id].push(
          <li key={result._id}>{result.answer}</li>
        );
      }
      else {
        results_obj[id] = [ <li key={result._id}>{result.answer}</li> ];
      }
    });

    this.state.questions.map( function(row) {
      question_list.push(
        <div key={index}>
          <div className="row small-padding">
            <div className="col-md-6">
              <h4>{row.question_text}</h4>
              {results_obj[row._id]}
            </div>
          </div>
          <hr/>
        </div>
      );
      index++;
    });

    return (
      <div>
        <h2>{this.state.name}</h2>
        <div className="form-group">
          <label>Survey Results</label><br/>
          {question_list}
        </div>
        <Link to="/survey" className="btn btn-default" role="button" >Return</Link>
      </div>
    );
  }
});
