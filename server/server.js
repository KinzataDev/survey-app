var express = require("express");
var path = require("path");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var router = express.Router();
var Schema = mongoose.Schema;

var app = express();
app.use(express.static(path.join(__dirname,"../app/dist")));
app.use(bodyParser.json());


// Set up Mongoose, this should be in a separate file, time is lacking
var Survey = new Schema({
  survey_id: { type: Schema.ObjectId },
  name: { type: String },
  questions: [
    {
      question_id: Schema.ObjectId,
      question_text: String,
      answer: {
        answer_id: Schema.ObjectId,
        answer_type: {type:String, default: 'Text'},
        answer_text: {type:String, default: 'Answers|separated|by|pipes'}
      }
    }
  ],
  responses: [
    {
      response_id: Schema.ObjectId,
      question_id: String,
      question_text: String,
      answer: String
    }
  ]
});
mongoose.model('Survey', Survey);

var AnswerType = new Schema({
  answer_type_id: { type: Schema.ObjectId },
  answer_type: { type: String },
});
mongoose.model('AnswerType', AnswerType);
mongoose.connect('mongodb://localhost/surveyapp');

// Preload data if non-existant
var answer_types = mongoose.model('AnswerType');
var query = answer_types.find({}, function(err, data) {
  if( data.length == 0 ) {
    var insert_data = [{answer_type:'Text'},{answer_type:'Checkbox'},{answer_type:'Radio'}];
    answer_types.create( insert_data, function( err, text, checkbox, radio ) {
    });
  }
})

// ROUTES
router.get('/', function (req, res) {
  res.sendfile('app/dist/index.html');
});

router.post('/login', function(req, res) {
  // Skipping authentication to focus on the rest
  res.json({"success": "1"});
});

router.get('/survey', function (req, res) {
  var survey = mongoose.model('Survey');

  // Return all surveys
  var query = survey.find({}, function(err, docs) {
    res.json({data: docs});
  });
});

router.post('/survey', function(req, res) {
  var data = req.body;
  var survey = mongoose.model('Survey');
  survey.create(data, function( err, small ) {
  });

  res.json({success:1, message: "Survey created successfully."});
});

router.get('/survey/:id', function(req, res) {
  var id = req.params.id;
  var survey = mongoose.model('Survey');
  var query = survey.findById(id, function(err, record) {
    res.json({success:1, data: record});
  });
});

router.put('/survey/:id', function(req, res) {
  var id = req.params.id;
  var survey = mongoose.model('Survey');
  var query = survey.findOneAndUpdate({_id: id}, req.body, function(err, record) {
    res.json({success:1, data: record});
  });
});

router.delete('/survey/:id', function(req, res) {
  var id = req.params.id;
  var survey = mongoose.model('Survey');
  var record = survey.find({_id: id}).remove( function(){} );

  res.json({success:1, message: "Survey deleted successfully."});
});

router.put('/survey/:id/take', function(req, res) {
  var id = req.params.id;
  var survey = mongoose.model('Survey');
  var query = survey.findById({_id: id}, function(err, record) {
    req.body.responses.map(function(response) {
      record.responses.push(response);
    })
    record.save(function(err){})
    res.json({data:record});
  });
});

router.get('/survey/:id/results', function(req, res) {
  var id = req.params.id;
  var survey = mongoose.model('Survey');
  var query = survey.findById({_id: id}).
    select('responses.question_id responses.answer responses._id').exec(function(err, record) {
      console.log(record);
      res.json({data:record.responses});
  });
});

router.get('/answertype', function (req, res) {
  var type = mongoose.model('AnswerType');

  // Return all surveys
  var query = type.find({}, function(err, docs) {
    res.json({data: docs});
  });
});

app.use("/",router);

app.listen(3000, function() {
  console.log("Started listening on port", 3000);
})
