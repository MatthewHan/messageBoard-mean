// require the path module
var path = require("path");
// require express and create the express app
var express = require("express");
var app = express();
// require bodyParser since we need to handle post data for adding a user
var bodyParser = require("body-parser");
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/messageBoard');

app.use(bodyParser.urlencoded({
  extended: true
}));
// static content
app.use(express.static(path.join(__dirname, "./public")));
// set the views folder and set up ejs
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

var MessageSchema = new mongoose.Schema({
	name:String,
	message:String,
	comments: [{name:String, comment:String}]
})

var Message = mongoose.model('Message', MessageSchema);

// root route
app.get('/', function(req, res) {
	Message.find({},function(err,messages){
		if(err){
			console.log('something went wrong');
		} else {
			res.render('index',{data:messages});
		}
	})
})
app.post('/message',function(req,res){
	console.log("POST DATA", req.body);
	var message = new Message({name: req.body.name, message: req.body.message});
	message.save(function(err){
		if(err){
			console.log('something went wrong');
		} else {
			console.log('message added');
			res.redirect('/');
		}
	})
})
app.post('/message/:id',function(req,res){
	console.log("POST DATA", req.body);
	//var comment = new Comment({name:req.body.name, comment: req.body.comment});
	Message.findByIdAndUpdate(req.params.id,{$push: { 'comments': {name:req.body.name, comment: req.body.comment}}}, function (err, message){
		if(err){
			console.log('something went wrong');
			console.log(err);
		} else {
			console.log('yay');
			res.redirect('/');
		}
	})
})
// listen on 8000
app.listen(8000, function() {
 console.log("listening on port 8000");
})