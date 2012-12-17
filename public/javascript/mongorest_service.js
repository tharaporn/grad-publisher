var app = angular.module('mongorest_service', ['ngResource']);

app.factory('Schema', function($resource) {
  var Schema = $resource('/db/schema/:document', {    
    document: '@idocument'
  },
  {update: { method:'PUT' }});
  return Schema;
});

app.factory('Order', function($resource) {
  var Order = $resource('/db/order/:document', {    
    document: '@document'
  },
  {update: { method:'PUT' }});
  return Order;
});

app.factory('Payment', function($resource) {
  var Order = $resource('/pay/order/:document', {    
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
    '/currentdate',     
    {         
    });                         
  return CDate;    
});
