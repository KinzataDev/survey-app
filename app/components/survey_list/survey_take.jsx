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

  componentDidMount: function() {
    this.getSurveyData();
  },

  handleResponseChange: function(index,e) {
    var questions_data = this.state.questions;
    questions_data[index].response = e.target.value;
    this.setState({questions: questions_data});
  },

  handleBoxClicked: function(index,value,e) {
    var questions_data = this.state.questions;
    if( !questions_data[index].response ) {
      questions_data[index].response = {};
    }
    var response = questions_data[index].response;
    if(response[value]) {
      delete response[value];
    }
    else {
      response[value] = value;
    }
    questions_data[index].response = response;
    console.log(response);
    this.setState({questions: questions_data});
  },

  handleRadioClicked: function(index,value,e) {
    var questions_data = this.state.questions;
    questions_data[index].response = value;
    console.log(value);
    this.setState({questions: questions_data});
  },

  handlePostResponse: function(e) {
    var name = this.state.name;
    var questions = this.state.questions;
    var responses = [];

    questions.map(function(question) {
      var response_answer = '';
      if(typeof question.response == "string" ) {
        response_answer = question.response;
      }
      else if( typeof question.response == "object" ) {
        response_answer = Object.keys(question.response).join('|');
      }
      responses.push({
        question_id: question._id,
        question_text: question.question_text,
        answer: response_answer
      })
    });

    var data = {
        responses
    };

    $.ajax({
      url: "/survey/" + this.props.params.id + "/take",
      type: "PUT",
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function(res) {
        console.log(res.message);
        window.location = "/#/survey";
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
      }.bind(this)
    });
  },

  render: function() {

    var question_list = [];
    var index = 0;
    var parent = this;

    this.state.questions.map( function(row) {
      var response_field;
      if( row.answer.answer_type == 'Text' ) {
        response_field =
        <input
            type="text"
            defaultValue={row.response}
            onChange={parent.handleResponseChange.bind(parent,index)}
            className="form-control"
        />
      }
      else if ( row.answer.answer_type == "Checkbox" ) {
        var boxes = [];
        var values = row.answer.answer_text.split('|');
        values.map(function(value){
          boxes.push(
            <div key={value} className="checkbox">
              <label>
                <input
                  type="checkbox"
                  value={value}
                  onClick={parent.handleBoxClicked.bind(parent,index,value)}
                />
                {value}
              </label>
            </div>
          );
        })
        response_field = boxes;
      }
      else if ( row.answer.answer_type == "Radio") {
        var buttons = [];
        var values = row.answer.answer_text.split('|');
        values.map(function(value){
          buttons.push(
            <div key={value} className="radio">
              <label>
                <input
                  type="radio"
                  value={value}
                  name={row._id}
                  onClick={parent.handleRadioClicked.bind(parent,index,value)}
                />
                {value}
              </label>
            </div>
          );
        })
        response_field = buttons;
      }

      question_list.push(
        <div key={index}>
          <div className="row small-padding">
            <div className="col-md-6">
              <h4>{row.question_text}</h4>
              {response_field}
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
          <label>Questions</label><br/>
          {question_list}
        </div>
        <input className="btn btn-default right-margin" type="submit" value="Submit" onClick={this.handlePostResponse}/>
        <Link to="/survey" className="btn btn-danger" role="button" >Discard</Link>
      </div>
    );
  }
});
