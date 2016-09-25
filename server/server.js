var express = require("express");
var path = require("path");

var router = express.Router();

var app = express();
app.use(express.static(path.join(__dirname,"../app/dist")));

router.get('/', function (req, res) {
  res.sendfile('app/dist/index.html');
});

router.post('/login', function(req, res) {
  res.json({"success": "1"});
});

router.get('/survey', function (req, res) {
  // Connect to MongoDB and gather data

  // Test data
  var data = [
    {
      survey_id: "1",
      name: "Survey 1"
    },{
      survey_id: "2",
      name: "Survey 2"
    },{
      survey_id: "3",
      name: "Survey 3"
    },{
      survey_id: "4",
      name: "Survey 4"
    },{
      survey_id: "5",
      name: "Survey 5"
    },
  ];

  res.json({data: data});
});

app.use("/",router);

app.listen(3000, function() {
  console.log("Started listening on port", 3000);
})
