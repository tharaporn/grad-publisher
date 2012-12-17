var express = require("express");
var handlebars = require("hbs");
var config = require('./config');
var mongo_con = require('mongo-connect');

var app = express();

var mongo = mongo_con.Mongo({  
  host:'10.10.20.75',
  db:'charge'
});

var mongo_limit = mongo_con.Mongo({
  max:1,
  host:'10.10.20.75',
  db:'charge'
});


app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));    
  app.set('views', __dirname + '/views');
  app.engine('html', handlebars.__express);  
  app.set('view engine', 'html');      
  app.use(express.methodOverride());
});

app.get('/currentdate', function(req, res) {
  var cdate = new Date();  
  res.json({'year':cdate.getFullYear(), 'month':cdate.getMonth(), 'date':cdate.getDate()});
});

app.get('/', function(req, res) {
  var ctx = {title : 'Graduate School Publisher System', baseHref:config.site.baseUrl};    
  res.render('index', ctx);
});

app.get('/db/:collection/:id?', mongo.query);
app.post('/db/:collection', mongo.insert);
app.put('/db/:collection/:id', mongo.update);
app.del('/db/:collection/:id', mongo.delete);

app.get('/pay/:collection/:id?', mongo_limit.query);
app.put('/pay/:collection/:id', mongo_limit.update);

app.listen(config.site.port || 3000);

console.log("Mongo Express server listening on port " + (config.site.port || 3000));
