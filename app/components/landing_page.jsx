var React = require("react");
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var IndexRoute = require('react-router').IndexRoute;

var LandingPageIntro = require('./landing_page/landing_page_intro.jsx')
var UserLoginPage = require('./landing_page/user_login.jsx')
var SurveyList = require('./survey_list.jsx')
var SurveyCreate = require('./survey_list/survey_create.jsx');
var SurveyEdit = require('./survey_list/survey_edit.jsx');
var SurveyTake = require('./survey_list/survey_take.jsx');
var SurveyResults = require('./survey_list/survey_results.jsx');

module.exports = React.createClass({

  render: function() {
    return (
      <div className='LandingPage'>
        <div id="landing_page">
        </div>
        <Router>
          <Route path="/" component={LandingPageIntro} />
          <Route path="login" component={UserLoginPage} />
          <Route path="survey">
            <IndexRoute component={SurveyList} />
            <Route path="create" component={SurveyCreate} />
            <Route path=":id">
              <IndexRoute component={SurveyEdit} />
              <Route path="take" component={SurveyTake} />
              <Route path="results" component={SurveyResults} />
            </Route>
          </Route>
        </Router>
        <hr/>
      </div>
    )
  }
});
