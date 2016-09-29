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
      initial_name: '',
      questions: [],
      answer_types: []
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

  getAnswerTypeData: function() {
    $.ajax({
      url: "/answertype",
      dataType: "json",
      type: "GET",
      success: function(data) {
        this.setState({answer_types: data.data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
      }.bind(this),
    })

    return;
  },

  componentDidMount: function() {
    this.getAnswerTypeData();
    this.getSurveyData();
  },

  handleAddClicked: function() {
    var questions_data = this.state.questions;
    questions_data.push(
      {
        question_text: '',
        answer: {
          answer_type: 'Text',
          answer_text: 'Answers|Separated|By|Pipes'
        }
      }
    );
    this.setState({questions: questions_data});
  },

  handleAddAnswerClicked: function(index) {
    var questions_data = this.state.questions;
    questions_data[index].answers.push({answer_text: ''});
    this.setState({questions: questions_data});
  },

  handleDeleteClicked: function(index) {
    var questions_data = this.state.questions;
    questions_data.splice(index,1);
    this.setState({questions: questions_data});
  },

  handleQuestionTextChange: function(index,e) {
    console.log(index);
    var questions_data = this.state.questions;
    questions_data[index].question_text = e.target.value;
    this.setState({questions: questions_data});
  },

  handleAnswerTextChange: function(index, e) {
    var questions_data = this.state.questions;
    questions_data[index].answer.answer_text = e.target.value;
    this.setState({questions: questions_data});
  },

  handleNameChange: function(e) {
    this.setState({name: e.target.value});
  },

  handleAnswerTypeChange: function(index, e) {
    var questions_data = this.state.questions;
    questions_data[index].answer.answer_type = e.target.value;
    this.setState({questions: questions_data});
  },

  handlePutSurvey: function(e) {
    var name = this.state.name;
    var questions = this.state.questions;

    var data = {
      name: name,
      questions: questions
    };

    $.ajax({
      url: "/survey/" + this.props.params.id,
      type: "PUT",
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function(res) {
        window.location = "/#/survey";
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
      }.bind(this)
    });
  },

  render: function() {

    var question_list = [];
    var answer_type_list = [];
    var index = 0;
    var parent = this;

    this.state.answer_types.map( function(row) {
      console.log(row);
      answer_type_list.push(
        <option key={row.answer_type}>{row.answer_type}</option>
      );
    });

    this.state.questions.map( function(row) {
      question_list.push(
        <div key={index}>
          <div className="row small-padding">
            <div className="col-md-6">
              <input
                  type="text"
                  value={row.question_text}
                  onChange={parent.handleQuestionTextChange.bind(parent,index)}
                  className="form-control"
              />
            </div>
            <div className="col-md-6">
              <button className="btn btn-danger btn-xs" onClick={parent.handleDeleteClicked.bind(parent, index)}>X</button>
            </div>
          </div>
          <div className="row small-padding left-margin-large">
            <div className="col-md-6">
              <label>Answer</label>
              {row.answer.answer_type == 'Text'
                ? <div><label>Free form text.</label></div>

                : <input
                    type="text"
                    defaultValue={row.answer.answer_text}
                    onChange={parent.handleAnswerTextChange.bind(parent,index)}
                    className="form-control"
                  />
              }
            </div>
          </div>
          <div className="row small-padding left-margin-large">
            <div className="col-md-12">
              <label>Answer Type</label>
              <select className="form-control" value={row.answer.answer_type} onChange={parent.handleAnswerTypeChange.bind(parent,index)}>
                {answer_type_list}
              </select>
            </div>
          </div>
          <hr/>
        </div>
      );
      index++;
    });

    return (
      <div>
        <h2>Modify Survey: {this.state.initial_name}</h2>

          <div className="form-group">
          <label>Survey Name</label>
          <input
              type="text"
              value={this.state.name}
              onChange={this.handleNameChange}
              className="form-control"
          />
          </div>
          <div className="form-group">
            <label>Questions</label><br/>
            {question_list}
            <button className="btn btn-success btn-xs" onClick={this.handleAddClicked}>Add Question</button>
          </div>
          <input className="btn btn-default right-margin" type="submit" value="Submit" onClick={this.handlePutSurvey}/>
          <Link to="/survey" className="btn btn-danger" role="button" >Cancel</Link>

      </div>
    );
  }
});
