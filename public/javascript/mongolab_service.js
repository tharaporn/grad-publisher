var app = angular.module('mongolab_service', ['ngResource']);



app.factory('Schema', function($resource) {
    var Schema  = $resource('https://api.mongolab.com/api/1/databases/charge/collections/schema/:id', {
      id:'@id',
      apiKey:'506b96b5e4b0b2e219506689'},{
      update: { method: 'PUT' }
    });           
     /*   
    Order.prototype.update = function(cb) {
        return Order.update({id: this._id.$oid},
            angular.extend({}, this, {_id:undefined}), cb);
    };
    

    Order.prototype.destroy = function(cb) {
        return Order.remove({id: this._id.$oid}, cb);
      };
    */
    return Schema;
});
 
//app.factory('Report', function($resource) { 
 //var report = $resource('https://github.com/devongovett/pdfkit.git',{
      
 //  });

app.factory('Order', function($resource) {
  /*
  var Order = $resource('http://www.db.grad.nu.ac.th/apps/mongodb/databases/publisher/collections/order/:id', {
    id:'@id'}, {  
    update: { method: 'PUT' }
  });       
      
  */
  var Order = $resource('https://api.mongolab.com/api/1/databases/charge/collections/order/:id', {
    id:'@id',
    apiKey:'506b96b5e4b0b2e219506689'},{
    update: { method: 'PUT' }
  });
   
            
    /* 
    Order.prototype.update = function(cb) {
        return Order.update({id: this._id.$oid},
            angular.extend({}, this, {_id:undefined}), cb);
    };
    
     
    Order.prototype.destroy = function(cb) {
        return Order.remove({id: this._id.$oid}, cb);
      };
    */
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
