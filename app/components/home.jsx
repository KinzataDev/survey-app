var React = require("react");
var LandingPage = require("./landing_page.jsx")

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Stellar Survey</h1>
        <hr/>
        <LandingPage />
      </div>
    )
  }
});
