var React = require("react");
var ReactDOM = require("react-dom");
var Home = require("./components/home.jsx");

function render() {
  ReactDOM.render(<Home />, document.getElementById("container"));
}
render();
