var app = angular.module('charge', ['mongorest_service']);

app.config(function($routeProvider) {
  $routeProvider.when('/', {
    controller:MainController, 
    templateUrl:'static/index.html'
  });    	  
  
  $routeProvider.when('/order/receipt/:id', {
    controller:OrderReceiptController, 
    templateUrl:'static/receipt_form.html'
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


function OrderObject(order) { 
  var self = this;   
  this.order = order;
    
  var h_copy = 0;
  var s_copy = 0;    
  
  this.book = function() {
    if(order.hardcopy.item) {
      h_copy = parseInt(order.hardcopy.item);
    }
    if(order.softcopy.item) {
      s_copy = parseInt(order.softcopy.item);
    }              
    return h_copy + s_copy;
  };
  
  if(order.hardcopy.item) {
    h_copy = parseInt(order.hardcopy.item);
  }
  if(order.softcopy.item) {
    s_copy = parseInt(order.softcopy.item);
  }              
  
  this.total_section_2p = function() {
     return self.book() * order.total_section_2p;
  };
  
  /*
  this.total_section_2wd_A4 = (h_copy+s_copy) * order.total_section_2wd_A4;
  this.total_section_2wd_F4 = (h_copy+s_copy) * order.total_section_2wd_F4;
  this.total_section_2wd_B4 = (h_copy+s_copy) * order.total_section_2wd_B4;
  this.total_section_2wd_A3 = (h_copy+s_copy) * order.total_section_2wd_A3;
  this.total_section_2color_A4 = (h_copy+s_copy) * order.total_section_2color_A4;
  this.total_section_2color_F4 = (h_copy+s_copy) * order.total_section_2color_F4;
  this.total_section_2color_B4 = (h_copy+s_copy) * order.total_section_2color_B4;
  this.total_section_2color_A3 = (h_copy+s_copy) * order.total_section_2color_A3;
  */
  
  this.total_section2 = function() {    
    var preface_item = 0;
    var wd_A4_item = 0;
    var wd_F4_item = 0;
    var wd_B4_item = 0;
    var wd_A3_item = 0;
    var color_A4_item = 0;
    var color_F4_item = 0;
    var color_B4_item = 0;
    var color_A3_item = 0;
    
    if(order.preface.item) preface_item = order.preface.item;
    if(order.wd_A4.item) wd_A4_item = order.wd_A4.item;
    if(order.wd_F4.item) wd_F4_item = order.wd_F4.item;
    if(order.wd_B4.item) wd_B4_item = order.wd_B4.item;
    if(order.wd_A3.item) wd_A3_item = order.wd_A3.item;
    if(order.color_A4.item) color_A4_item = order.color_A4.item;
    if(order.color_F4.item) color_F4_item = order.color_F4.item;
    if(order.color_B4.item) color_B4_item = order.color_B4.item;
    if(order.color_A3.item) color_A3_item = order.color_A3.item;
    
    var copy_price = (preface_item * order.preface.price) +
      (wd_A4_item * order.wd_A4.price) +
      (wd_F4_item * order.wd_F4.price) +
      (wd_B4_item * order.wd_B4.price) +
      (wd_A3_item * order.wd_A3.price) +
      (color_A4_item * order.color_A4.price) +
      (color_F4_item * order.color_F4.price) +
      (color_B4_item * order.color_B4.price) +
      (color_A3_item * order.color_A3.price);      ;
      
    return copy_price * self.book();
    
    /*
    return (h_copy+s_copy) * (order.total_section_2p + 
      order.total_section_2wd_A4 + 
      order.total_section_2wd_F4+ 
      order.total_section_2wd_B4+ 
      order.total_section_2wd_A3+ 
      order.total_section_2color_A4+ 
      order.total_section_2color_F4+ 
      order.total_section_2color_B4+ 
      order.total_section_2color_A3);  
      */
  };
      
  var num_page = parseInt(order.more.item);        
  this.extra_page = 0;
  if(num_page - 200 > 0) {  
    this.extra_page = Math.ceil((num_page-200)/50)*10*(h_copy+s_copy);
  }
    
  // this.total = this.total_section2+ ....
    
}

function OrderReceiptController($scope, $routeParams, $location, Order, Program, Student) {
  console.log($routeParams.id);
  Order.get({document:$routeParams.id}, function(response) {
    self.original = response;
    $scope.order = new Order(self.original);
    //console.log(response);    
        
    Student.get({
      id:response.student.id, 
      fields:JSON.stringify(["id", "prefix_name", "first_name", "last_name", "program", "faculty", "level"]),
      relations:JSON.stringify(["program", "faculty", "level"])
    }, function(response) {
      console.log(response);
      $scope.student = response;            
      Program.get({
        id:response.program.id,        
        fields:JSON.stringify(["id", "name"]),
        relations:JSON.stringify(["faculty","level", "program"])
      }, function(r_program) {
        console.log('Get Program');
        console.log(r_program);
        $scope.student.faculty = r_program.faculty;
        $scope.student.level = r_program.level;
      });              
    });
    
    if('item' in response.more) {
      var num_page = parseInt(response.more.item);
      if(num_page - 200 > 0) {
        var h_copy = 0;
        var s_copy = 0;
        
        if(response.hardcopy.item) {
          h_copy = parseInt(response.hardcopy.item);
        }
        if(response.softcopy.item) {
          s_copy = parseInt(response.softcopy.item);
        }              
        $scope.extra_page = Math.ceil((num_page-200)/50)*10*(h_copy+s_copy);
      }
    }
  });    

}

function OrderController($scope, $routeParams, $location, Order, Student, Program, CurrentDate, Payment) {
  console.log($routeParams.id);
  
  $scope.pay = function() {
    var id = $routeParams.id
  };
  
  Order.get({document:$routeParams.id}, function(response) {
    self.original = response;
    $scope.order = new Order(self.original);    
    
    $scope.order_obj = new OrderObject(response);
    
    console.log(response);
    
    CurrentDate.get(function(response) {      
      $scope.date = {};
      $scope.date['date'] = response.date;
      $scope.date['year'] = response.year + 543;
      $scope.date['month'] = response.month + 1;
      var month_array = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
      $scope.date['month'] = month_array[response.month];
      $scope.order.date = $scope.date;
    });
    
    
    
    Student.get({
      id:response.student.id, 
      fields:JSON.stringify(["id", "prefix_name", "first_name", "last_name", "program", "faculty", "level"]),
      relations:JSON.stringify(["program", "faculty", "level"])
    }, function(response) {
      console.log(response);
      $scope.student = response;            
      Program.get({
        id:response.program.id,        
        fields:JSON.stringify(["id", "name"]),
        relations:JSON.stringify(["faculty","level", "program"])
      }, function(r_program) {
        console.log('Get Program');
        console.log(r_program);
        $scope.student.faculty = r_program.faculty;
        $scope.student.level = r_program.level;
      });              
    });
    
    var num_page = parseInt(response.more.item);
    $scope.extra_page = 0;
    if(num_page - 200 > 0) {
      var h_copy = 0;
      var s_copy = 0;
      
      if(response.hardcopy.item) {
        h_copy = parseInt(response.hardcopy.item);
      }
      if(response.softcopy.item) {
        s_copy = parseInt(response.softcopy.item);
      }              
      $scope.extra_page = Math.ceil((num_page-200)/50)*10*(h_copy+s_copy);
    }
    
    order = response;
    
    $scope.total = order.total_section_1h + 
      order.total_section_1s + 
      $scope.extra_page + 
      order.total_section_2p + 
      order.total_section_2wd_A4 + 
      order.total_section_2wd_F4+ 
      order.total_section_2wd_B4+ 
      order.total_section_2wd_A3+ 
      order.total_section_2color_A4+ order.total_section_2color_F4+ 
      order.total_section_2color_B4+ order.total_section_2color_A3 + 
      order.total_section_3 + order.total_section_4;    
    
  });   
  
  $scope.pay = function() {
    var c_year = $scope.date['year'];
    // {'year':2555, 'id':1}        
    Payment.query({"query":'{"payment_id":{"$exists": true}, "payment_id.year":'+c_year+'}'},function(response) {      
      $scope.order['payment_id'] = {'year':$scope.date['year'], 'id': response.length+1};  
      var id = $scope.order._id;
      var order = angular.extend({}, $scope.order, {_id:undefined});        
      Payment.update({'document':id}, order, function(response) {
          // message
      });      
    });    
  };
 
   $scope.destroy = function() {
     if(!$scope.order.payment_id) {
      Order.remove({'document':$scope.order._id}, function(response) {
        console.log(response);
        $location.path('/');
      });
    }
  };
}



function OrderListController($scope,$routeParams, $location, Order) {
  //console.log('hello');
  $scope.order_list = Order.query(function(response) {
    console.log(response);
  });   

}

function MainController($scope, Student, Schema, Order, Program) {
  var self = this;  
  
  $scope.isNotStudent = function() {    
    if($scope.student) return false;
    return true;
  }
  
  $scope.get_student = function() {
    Student.get({
      id:$scope.student_id, 
      fields:JSON.stringify(["id", "prefix_name", "first_name", "last_name"]),
      relations:JSON.stringify(["program"])
    }, function(response) {
      $scope.student = response;
      if($scope.schema) {
        $scope.schema.student = $scope.student;
        Program.get({
          id:response.program.id,        
          fields:JSON.stringify(["id", "name"]),
          relations:JSON.stringify(["faculty","level"])
        }, function(r_program) {
          console.log(r_program);
          $scope.student.faculty = r_program.faculty;
          $scope.student.level = r_program.level;
        });        
      }
    });
    
  };
  
  
  Schema.get({document:"50cada85331002dc1d000001"}, function(response) {
    $scope.order = new OrderObject(response);
    console.log($scope.order);     
    $scope.schema = $scope.order.order;      
    
    
    $scope.$watch("schema.hardcopy.item + schema.softcopy.item + schema.more.item", function(n, o) {    
      $scope.schema.total_section_1h = $scope.schema.hardcopy.item * $scope.schema.hardcopy.price;
      $scope.schema.total_section_1s = $scope.schema.softcopy.item * $scope.schema.softcopy.price;      
          
      if(isNaN($scope.schema.total_section_1h)) {
        $scope.schema.total_section_1h = 0;
      }
      
      if(isNaN($scope.schema.total_section_1s)) {
        $scope.schema.total_section_1s = 0;n * $scope.schema.wd_A4.price 
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
      $scope.schema.total_section_2p = n * $scope.schema.preface.price ;
    });

    $scope.$watch("schema.wd_A4.item", function(n, o) {
      $scope.schema.total_section_2wd_A4 = n * $scope.schema.wd_A4.price ;
    });
  
    $scope.$watch("schema.wd_F4.item", function(n, o) {
      $scope.schema.total_section_2wd_F4 = n * $scope.schema.wd_F4.price ;
    });
  
    $scope.$watch("schema.wd_B4.item", function(n, o) {
      $scope.schema.total_section_2wd_B4 = n * $scope.schema.wd_B4.price ;
    });
  
    $scope.$watch("schema.wd_A3.item", function(n, o) {
      $scope.schema.total_section_2wd_A3 = n * $scope.schema.wd_A3.price ;
    });
  
    $scope.$watch("schema.color_A4.item", function(n, o) {
      $scope.schema.total_section_2color_A4 = n * $scope.schema.color_A4.price ;
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

