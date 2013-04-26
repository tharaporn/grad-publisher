var app = angular.module('mongorest_service', ['ngResource']);
//var prefix = 'apps/grad-publisher';
var prefix = '';

app.factory('Schema', function($resource) {
  var Schema = $resource(prefix+'/db/schema/:document', {    
    document: '@idocument'
  },
  {update: { method:'PUT' }});
  return Schema;
});


app.factory('Reviewer', function($resource) {
  var Reviewer = $resource(prefix+'/db/reviewer/:id', {    
    id: '@idocument'
  },
  {update: { method:'PUT' }});
  return Reviewer;
});


app.factory('Order', function($resource) {
  var Order = $resource(prefix+'/db/order/:document', {    
    document: '@document'
  },
  {update: { method:'PUT' }});
  return Order;
});

app.factory('User', function($resource) {
    var User  = $resource(prefix+'/user',{}, {});   
    return User;   
});

app.factory('Admin', function($resource) {
  var Admin = $resource(prefix+'/admin/users/:id', {
  },
  {update: { method:'PUT' }});
  return Admin;
});

app.factory('Logout', function($resource) {
    var Logout  = $resource(prefix+'/logout',{}, {});   
    return Logout ;   
});

app.factory('Role', function($resource) {
  var Role = $resource(prefix+'/db/user/:id', {    
    id: '@id'
  },
  {update: { method:'PUT' }});
  return Role;
});


app.factory('Payment', function($resource) {
  var Order = $resource(prefix+'/pay/order/:document', {    
    document: '@document'
  },
  {update: { method:'PUT' }});
  return Order;
});

app.factory('Student', function($resource) {
  var Student = $resource(
    'http://www.db.grad.nu.ac.th/django/rest/students/:id', 
    {callback:'JSON_CALLBACK'}, 
    {
      'query':  {method:'JSONP', isArray:true},
      'get':  {method:'JSONP'}
    });                         
  return Student;    
});



app.factory('Program', function($resource) {
  var Student = $resource(
    'http://www.db.grad.nu.ac.th/django/rest/programs/:id', 
    {callback:'JSON_CALLBACK'}, 
    {
      'query':  {method:'JSONP', isArray:true},
      'get':  {method:'JSONP'}
    });                         
  return Student;    
});


app.factory('CurrentDate', function($resource) {
  var CDate = $resource(
    prefix+'/currentdate',     
    {         
    });                         
  return CDate;    
});
