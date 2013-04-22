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
  
    $routeProvider.when('/status', {
    controller:OrderStatusController, 
    templateUrl:'static/status.html'
  }); 
  
    $routeProvider.when('/role', {
    controller:RoleController, 
    templateUrl:'static/role_manager.html'
  });	
   
    $routeProvider.when('/commit', {
    controller:CommitteeController, 
    templateUrl:'static/commit.html'
  });    
  
});

function UserCtrl($scope, User, Logout) {
  $scope.user = User.get(function(res) {
    console.log(res);
  });
  
  $scope.logout = function() {
    Logout.get(function(response){
      if(response.success){
        $scope.user = null;
        $scope.$broadcast('logout');
      }
    });
  };
}

function RoleController($scope, Role, User, Logout, Admin) {   
  var orig = null;
  $scope.users = Admin.query();
  //console.log($scope.users);
  $scope.get_user = function(id) {
    Admin.get({'id':id}, function(user) {
      var ng_role = [];
      $scope.user = user;//user is object, array
      orig = user;// ???
      if(user['role']) { //found
        angular.forEach(user.role, function(value, idx) {
          ng_role.push({'name':value});//??
        });
      }
      $scope.user['role'] = ng_role; // not found
    });
  };

  $scope.update = function() {
    var db_role = [];
    angular.forEach($scope.user.role, function(value, idx) {
      db_role.push(value.name);
    });
    orig['role'] = db_role;// ?? origin -- new user
    
    var doc = angular.extend({}, orig, {_id:undefined});
    //console.log(doc);
    Admin.update({'id':orig._id}, doc, function(response) { 
      console.log(response);
      if(response.success) {
        $scope.get_user(orig._id);
      }
    });
  };
  
}

function OrderObject(order) { 
  var self = this;   
  this.order = order;
    
  var h_copy = 0;
  var s_copy = 0;   
  
  if(order.hardcopy.item) {
    h_copy = parseInt(order.hardcopy.item);
  }
  if(order.softcopy.item) {
    s_copy = parseInt(order.softcopy.item);
  }              
  
  this.book = function() {
    if(order.hardcopy.item) {
      h_copy = parseInt(order.hardcopy.item);
    }
    if(order.softcopy.item) {
      s_copy = parseInt(order.softcopy.item);
    }              
    return h_copy + s_copy;
  };
  
  
  
  this.total_section_2p = function() {
     return self.book() * order.total_section_2p;
  };
  
  
  this.extra_page = function() {
    var num_page = parseInt(order.more.item);
    if(num_page - 200 > 0) {
      return Math.ceil((num_page-200)/50)*10*(h_copy+s_copy);
    }
    return num_page;
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
};  
  
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
      
  var num_page = parseInt(order.more.item);        
  this.extra_page = 0;
  this.del_page = 0;
  
  if(num_page - 200 > 0) {  
    this.del_page = Math.ceil(num_page-200);
    this.extra_page = Math.ceil((num_page-200)/50)*10*(h_copy+s_copy);
  }
    
  // this.total = this.total_section2+ ....
    
}

function OrderStatusController($scope, $routeParams, $location, Order, Student, Program, CurrentDate, Payment, User, Logout) {
  $scope.order_list = Order.query(function(response) {
    console.log(response);
  });     
};


function OrderReceiptController($scope, $routeParams, $location, Order, Program, Student, User, Logout) {
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

function OrderController($scope, $routeParams, $location, $filter, Order, Student, Program, Reviewer, CurrentDate, Payment, User, Logout) {
  var self = this;
  console.log($routeParams.id);
  
  self.message = function(message) {
    $scope.error_message  = true;
    $scope.message  = message;
    setTimeout(function(){ $scope.$apply(function() { $scope.error_message  = false; }); },4000);
  }
  
  $scope.update_order = function() {
    var c_order = angular.extend({}, $scope.order, {_id:undefined});    
    Order.update({document:$routeParams.id}, c_order, function(response) {
      if(response.error == 401) {
        self.message("คุณยังไม่ได้รับอนุมัติในการดำเนินการ");        
      } else {
        self.message("บันทึกข้อมูลเรียบร้อยแล้ว");        
      }
      console.log(response);    
    });
  }
  
  $scope.reviewer_list = Reviewer.query();
  
  
  $scope.save_doc = function() {                    
    Order.get({document:$routeParams.id}, function(order) {
      console.log(order);
      
      // remove currentdata.get
      /*
      CurrentDate.get(function(response) {            
        order['date'] = {};
        order.date['date'] = response.date;
        order.date['year'] = response.year + 543;
        order.date['month'] = response.month + 1;
        var month_array = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
        order.date['month'] = month_array[response.month];        
      });
      */
      
      
      
      var order_obj = new OrderObject(order);
      order['book'] = order_obj.book();
      order['extra_page'] = (order.format.item - 200) * order_obj.book();
      
      order['total_1_price'] = $filter('number')(order.total_section_1h + order.total_section_1s + order_obj.extra_page);
      
      //console.log(order);
      
      order['extra_page'] = $filter('number')(order.extra_page);
      
      order['extra_price'] = $filter('number')(order_obj.extra_page);      
      //console.log(order.total_1_price);
      
      order['page_21'] = $filter('number')((order_obj.order.preface.item) * order_obj.book());
      order['page_22'] = $filter('number')((order.wd_A4.item) * order_obj.book());   
      order['page_23'] = $filter('number')((order.wd_F4.item) * order_obj.book());         
      order['page_24'] = $filter('number')((order.wd_B4.item) * order_obj.book());   
      order['page_25'] = $filter('number')((order.wd_A3.item) * order_obj.book());     
      order['page_26'] = $filter('number')((order.color_A4.item) * order_obj.book());   
      order['page_27'] = $filter('number')((order.color_F4.item) * order_obj.book());         
      order['page_28'] = $filter('number')((order.color_B4.item) * order_obj.book());   
      order['page_29'] = $filter('number')((order.color_A3.item) * order_obj.book());  
      order['total_2_page'] = $filter('number')(order.more.item * order_obj.book());
      
      order['price_21'] = $filter('number')(order_obj.total_section_2p());
      order['price_22'] = $filter('number')(order_obj.order.total_section_2wd_A4 * order_obj.book());   
      order['price_23'] = $filter('number')(order_obj.order.total_section_2wd_F4 * order_obj.book());          
      order['price_24'] = $filter('number')(order_obj.order.total_section_2wd_B4 * order_obj.book());  
      order['price_25'] = $filter('number')(order_obj.order.total_section_2wd_A3 * order_obj.book());           
      order['price_26'] = $filter('number')(order_obj.order.total_section_2color_A4 * order_obj.book());   
      order['price_27'] = $filter('number')(order_obj.order.total_section_2color_F4 * order_obj.book());          
      order['price_28'] = $filter('number')(order_obj.order.total_section_2color_B4 * order_obj.book());  
      order['price_29'] = $filter('number')(order_obj.order.total_section_2color_A3 * order_obj.book());     
      order['total_2_price']= $filter('number')(order_obj.total_section2());
      
      order['total_3_price'] = $filter('number')(order.total_section_3);
      order['total_4_price'] = $filter('number')(order.total_section_4);    
      
      order['total_all'] = $filter('number')(order.total_section_1h + order.total_section_1s + order_obj.extra_page + order_obj.total_section2() + order.total_section_3 + order.total_section_4);
      
      order['total_section_1h'] = $filter('number')(order.total_section_1h);
      
    
      var dataUrl = '/bill/form?order=' + JSON.stringify(order);      
      var link = document.createElement('a');
      angular.element(link)
        .attr('href', dataUrl)
        .attr('download', 'test.xml') // Pretty much only works in chrome
      link.click();                      
    });
    
    //$http.get('/bill/form').success(function(res) {            
    //  console.log(res);
      
      
  };
  
  
  
  $scope.pay = function() {
    var id = $routeParams.id
  };
  
 
  console.log('get order by id');
  Order.get({document:$routeParams.id}, function(response) {
    console.log(response);    
    self.original = response;
    $scope.order = new Order(self.original);  
    
    $scope.order_obj = new OrderObject(response);
   // console.log("-->"+$scope.order_obj.book());  
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
    
   /* 
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
  */ 
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

function OrderListController($scope, $routeParams, $location, Order, User, Logout) {
  $scope.order_list = Order.query(function(response) {
      console.log(response);
    }); 

}

function CommitteeController($scope, Reviewer) {  
  //self.message("บันทึกข้อมุลเรียบร้อยแล้ว");  
  $scope.reviewer_list = Reviewer.query();
  
  $scope.select_reviewer = function(reviewer) {
    $scope.selected_reviewer = reviewer;
  }
  
  $scope.save_reviewer = function() {
    if($scope.selected_reviewer._id) {
      Reviewer.update({id:$scope.selected_reviewer._id},
        angular.extend({}, $scope.selected_reviewer, {_id:undefined}),
        function(res) {
          console.log(res);
          $scope.reviewer_list = Reviewer.query();
      });
        
    } else {
      Reviewer.save({},
        angular.extend({}, $scope.selected_reviewer),
        function(res) {
          console.log(res);
          $scope.reviewer_list = Reviewer.query();
      });
       
    }
  }
}

function MainController($scope, Student, Schema, Order, Program, User, Logout,$http) {
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

