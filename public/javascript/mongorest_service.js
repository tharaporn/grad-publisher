var app = angular.module('mongorest_service', ['ngResource']);

app.factory('Schema', function($resource) {
  var Project = $resource('http://www.db.grad.nu.ac.th/apps/mongodb/databases/charge/collections/schema/:document', {    
    document: '@idocument'
  },
  {update: { method:'PUT' }});
  return Schema;
});

angular.module('mongo_stats_service', ['ngResource']).
factory('MongoStats', function($resource) {
  var MongoStats = $resource('http://www.db.grad.nu.ac.th/apps/mongodb/stats/charge/schema', {
    collection: '@collection'
  },
  {info: { method:'GET' }});
  return MongoStats;
});

app.factory('Order', function($resource) {
  var Project = $resource('http://www.db.grad.nu.ac.th/apps/mongodb/databases/charge/collections/order/:document', {    
    document: '@idocument'
  },
  {update: { method:'PUT' }});
  return Schema;
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
