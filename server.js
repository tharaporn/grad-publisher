var express = require("express");
var handlebars = require("hbs");
var mongo_con = require("mongo-connect");
var passport = require('passport');
var fs = require("fs");

var userdb = require('./user_db');
//var routes = require('./routes');
var config = require('./config');

var app = express();
var OpenIDStrategy = require('passport-openid').Strategy;



var userprofile = new userdb.userprofile(config.authorization.mongodb);
var mongo = mongo_con.Mongo(config.mongo_connect);

/*
var mongo = mongo_con.Mongo({  
  host:'10.10.20.75',
  db:'charge'
});
*/


var mongo_limit = mongo_con.Mongo({
  max:1,
  host:'10.10.20.75',
  db:'charge'
});



app.configure(function() {
	app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.favicon());
  app.use(express.static(__dirname + '/public'));    
  app.set('views', __dirname + '/views');
  app.engine('html', handlebars.__express);  
  app.set('view engine', 'html');      
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());  	
});

passport.serializeUser(function(user, done) {
  console.log("test");
  userprofile.store(user, function(exists, user) {  
    done(null, user.identifier);
  });
});

passport.deserializeUser(function(identifier, done) {  
  userprofile.retrieve(identifier, function(exists, profile) {  
    if(profile) {    
      done(null, profile);
    } else {
      done(null, {identifier : identifier});
    }
  });
});

passport.use(new OpenIDStrategy({
  returnURL: config.site.baseUrl+'auth/openid/return',
  realm: config.site.baseUrl,
  profile: true}, function(identifier, profile, done) {
    //console.log(profile);
    process.nextTick(function () {    
      	return done(null, {identifier: identifier, profile:profile})
    });
  }
));

app.get('/auth/openid', 
	passport.authenticate('openid', { failureRedirect: '/login' }),
  		function(req, res) {
    		res.redirect(config.site.baseUrl);
});
  
app.get('/auth/openid/return', 
	passport.authenticate('openid', { failureRedirect: '/login' }),
  		function(req, res) {
    		res.redirect(config.site.baseUrl);
});

app.get('/user', function(req, res) {
  if(req.user) {
    res.json({'user':req.user});
  } else {
    res.json({'user':null});
  }
});

app.get('/logout', function(req, res){
  req.logOut();
  res.json({"success":true});var Handlebars
});

app.get('/currentdate', function(req, res) {
  var cdate = new Date();  
  res.json({'year':cdate.getFullYear(), 'month':cdate.getMonth(), 'date':cdate.getDate()});
});

app.get('/', function(req, res) {
  var ctx = {title : 'Graduate School Publisher System', baseHref:config.site.baseUrl};    
  res.render('index', ctx);
});

app.get('/bill/form', function(req,res) {  
  //console.log('Bill');  
  res.set( "Content-Disposition", "attachment; filename=\"bill.xml\"" );  
  res.render('bill', {'order':JSON.parse(req.query.order),layout:false});    
});

app.get('/admin/users', admin_role, userprofile.list_user);
app.get('/admin/users/:id', admin_role ,userprofile.get_user);
app.put('/admin/users/:id', admin_role ,userprofile.update_user);

app.get('/db/:collection/:id?', mongo.query);
app.post('/db/:collection', mongo.insert);
app.put('/db/:collection/:id', mongo.update);
app.del('/db/:collection/:id', mongo.delete);

app.get('/pay/:collection/:id?', mongo_limit.query);
app.put('/pay/:collection/:id', mongo_limit.update);

function admin_role(req,res,next) {
  console.log('admin_role');
  if(req.user) {
    userprofile.check_role(req.user.identifier, ["admin"], function(allow) {
      if(allow) {
          next();
      } else {
          next(new Error("401"));
      }
    });
  } else {
    console.log('no user signin');
    next(new Error("401"));    
  }
}

app.use(function(err,req,res,next) {  
  if(err instanceof Error){    
    if(err.message === '401'){
      res.json({'error':401});
    }
  }
});


app.listen(config.site.port || 3000);

console.log("Mongo Express server listening on port " + (config.site.port || 3000));
