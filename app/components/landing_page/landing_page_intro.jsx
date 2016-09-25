var React = require("react");
var Link = require('react-router').Link;

module.exports = React.createClass({

  handleUserSelect: function() {
    console.log("User option selected");
  },
  handleAdminSelect: function() {
    console.log("Admin option selected");
  },

  render: function() {
    return (
      <div>
        <Link className="Button" to="/login" onClick={this.handleUserSelect}>TAKE A SURVEY</Link>

        <button onClick={this.handleAdminSelect}>MAKE A SURVEY</button>
      </div>
    )
  }
});
