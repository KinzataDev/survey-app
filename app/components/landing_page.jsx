var React = require("react");
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;

var LandingPageIntro = require('./landing_page/landing_page_intro.jsx')
var UserLoginPage = require('./landing_page/user_login.jsx')
var SurveyList = require('./survey_list.jsx')

module.exports = React.createClass({

  render: function() {
    return (
      <div className='LandingPage'>
        <div id="landing_page">
        </div>
        <Router>
          <Route path="/" component={LandingPageIntro} />
          <Route path="login" component={UserLoginPage} />
          <Route path="survey" component={SurveyList} />
        </Router>
      </div>
    )
  }
});
