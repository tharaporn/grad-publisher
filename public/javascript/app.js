var app = angular.module('charge', ['mongolab_service']);

app.config(function($routeProvider) {
  $routeProvider.when('/', {
    controller:MainController, 
    templateUrl:'static/index.html'
  });    	  
  
  $routeProvider.when('/order', {
    controller:OrderListController, 
    templateUrl:'static/order.html'
  }); 
    
  $routeProvider.when('/order/:id', {
    controller:OrderController, 
    templateUrl:'static/charge_form.html'
  });    
    
});


function OrderController($scope, $routeParams, $location, Order) {
  console.log($routeParams.id);
}

function OrderListController($scope,$routeParams, $location, Order) {
  //console.log('hello');
  $scope.order_list = Order.query(function(response) {
    console.log(response);
  });   
}

/*
function OrderListController($scope, $routeParams, $location, Order) {
  var self = this;

  $scope.order_list = Order.query(function(response) {
    console.log(response);
  }); 
  
  Order.get({id:$routeParams.id}, function(response) {
    self.original = response;
    $scope.order = new Order(self.original);
    //console.log(response);
  }); 
  
  $scope.save = function() {        
    $scope.order.update(function() {
      $location.path('/');
    });    
  };     
  
  $scope.destroy = function() {
    self.original.destroy(function(response) {
      console.log(response);
      $location.path('/');
    });
  };
}
*/

function MainController($scope, Student, Schema, Order) {
  var self = this;  
  
  $scope.isNotStudent = function() {    
    if($scope.student) return false;
    return true;
  }
  
  $scope.get_student = function() {
    $scope.student = Student.get({id:$scope.student_id, fields:JSON.stringify(["first_name", "last_name", "id"])});
    if($scope.schema) {
      $scope.schema.student = $scope.student;
    }
  };
  
  
  Schema.get({id:"50937f24e4b010d72c562171"}, function(response) {
    $scope.schema = response;
    
    $scope.$watch("schema.hardcopy.item + schema.softcopy.item + schema.more.item", function(n, o) {    
      $scope.schema.total_section_1h = $scope.schema.hardcopy.item * $scope.schema.hardcopy.price;
      $scope.schema.total_section_1s = $scope.schema.softcopy.item * $scope.schema.softcopy.price;      
          
      if(isNaN($scope.schema.total_section_1h)) {
        $scope.schema.total_section_1h = 0;
      }
      
      if(isNaN($scope.schema.total_section_1s)) {
        $scope.schema.total_section_1s = 0;
      }      
      
      $scope.total_section_1 = $scope.schema.total_section_1h + $scope.schema.total_section_1s;            
      if(!$scope.schema.more) {
        $scope.schema.more = {'item':0};
      }                        
      var extra =  $scope.extra_page($scope.schema.more.item);
      
      if(!isNaN(extra)) {
        $scope.total_section_1 += extra;
      }        
    });            
    
    $scope.$watch("schema.preface.item", function(n, o) {
      $scope.schema.total_section_2p = n * $scope.schema.preface.price;
    });

    $scope.$watch("schema.wd_A4.item", function(n, o) {
      $scope.schema.total_section_2wd_A4 = n * $scope.schema.wd_A4.price;
    });
  
    $scope.$watch("schema.wd_F4.item", function(n, o) {
      $scope.schema.total_section_2wd_F4 = n * $scope.schema.wd_F4.price;
    });
  
    $scope.$watch("schema.wd_B4.item", function(n, o) {
      $scope.schema.total_section_2wd_B4 = n * $scope.schema.wd_B4.price;
    });
  
    $scope.$watch("schema.wd_A3.item", function(n, o) {
      $scope.schema.total_section_2wd_A3 = n * $scope.schema.wd_A3.price;
    });
  
    $scope.$watch("schema.color_A4.item", function(n, o) {
      $scope.schema.total_section_2color_A4 = n * $scope.schema.color_A4.price;
    });
  
    $scope.$watch("schema.color_F4.item", function(n, o) {
      $scope.schema.total_section_2color_F4 = n * $scope.schema.color_F4.price;
    });
  
    $scope.$watch("schema.color_B4.item", function(n, o) {
      $scope.schema.total_section_2color_B4 = n * $scope.schema.color_B4.price;
    });
  
    $scope.$watch("schema.color_A3.item", function(n, o) {
      $scope.schema.total_section_2color_A3 = n * $scope.schema.color_A3.price;
    });
  
    $scope.$watch("schema.cdcopy.item", function(n, o) {
      $scope.schema.total_section_3 = n * $scope.schema.cdcopy.price;
    });
  
    $scope.$watch("schema.format.item", function(n, o) {
      $scope.schema.total_section_4 = n * $scope.schema.format.price;
    });
    
  });    
  
  $scope.save = function() {
    console.log($scope.schema);
    var order = angular.extend({}, $scope.schema, {_id:undefined});
    console.log(order);
    Order.save(order, function(response) {
      console.log(response);
    //  $location.path('/edit/' + project._id.$oid);
    });
    
    
  }
  
    
  $scope.extra_page = function(page) {
    var num_page = parseInt(page);
    if(num_page - 200 > 0) {
      var h_copy = 0;
      var s_copy = 0;
      
      if($scope.schema.hardcopy.item) {
        h_copy = parseInt($scope.schema.hardcopy.item);
      }
      if($scope.schema.softcopy.item) {
        s_copy = parseInt($scope.schema.softcopy.item);
      }              
      return Math.ceil((num_page-200)/50)*10*(h_copy+s_copy);
    }
  }
  
  

}

