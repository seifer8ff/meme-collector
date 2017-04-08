var express 		= require("express"),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	methodOverride	= require("method-override"),
	app 			= express();



mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/meme-collector");
// use bodyparser
app.use(bodyParser.urlencoded({extended: true}));
// serve files in the public directory
app.use(express.static("public"));
// default to ejs templating
app.set("view engine", "ejs");
// override method for PUT requests
app.use(methodOverride("_method"));


var memeSchema = new mongoose.Schema({
	img: String,
	favorite: Boolean,
	dateAdded: {type: Date, default: Date.now},
	keywords: [String]
});

var Meme = mongoose.model("meme", memeSchema);

app.get("/", function(req, res) {
	res.redirect("/memes");
});

app.get("/memes", function(req, res) {
	Meme.find({}, function(err, memes) {
		if (err) {
			console.log("error");
		} else {
			res.render("index", {memes: memes});
		}
	});
});

app.get("/memes/new", function(req, res) {
	res.render("new");
});

app.post("/memes", function(req, res) {
	Meme.create(req.body.meme, function(err, newMeme) {
		if (err) {
			console.log("error");
			res.render("new");
		} else {
			res.redirect("/memes");
		}
	});
});




app.listen(3000, function() {
	console.log("server is listening");
})