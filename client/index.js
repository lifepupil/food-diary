'use strict';

angular.module('food-diary', ['firebase'])
.run(['$rootScope', '$window', function($rootScope, $window) {
  $rootScope.fbRoot = new $window.Firebase('https://ifood-diary.firebaseio.com/');


}])
.controller('master', ['$scope', '$firebaseObject', '$firebaseArray', function($scope, $firebaseObject, $firebaseArray) {
  var fbUser = $scope.fbRoot.child('user');
  var afUser = $firebaseObject(fbUser);
  $scope.user = afUser;

  var fbFoods = $scope.fbRoot.child('foods');
  var afFoods = $firebaseArray(fbFoods);
  $scope.foods = afFoods;

  $scope.saveFood = function() {
    console.log($scope.food);

    if ($scope.food.$id) {
      $scope.foods.$save($scope.food).then(function() {
        calculateBMI();
        $scope.food = {};
      })
    } else {
      var now = new Date();
      $scope.food.date = now.getTime();
      $scope.foods.$add($scope.food).then(function() {
        calculateBMI();
        $scope.food = {};
      });
    }

  };

  $scope.showUserForm = function() {
    $scope.isUserFormShown = true;

  };

  $scope.saveUser = function() {
    $scope.user.$save();
    $scope.isUserFormShown = false;
    calculateBMI();
  };

  $scope.user.$loaded().then(function() {
    calculateBMI();
  });

  $scope.BMIbuttonClicked = function() {
    calculateBMI();
  };

  function calculateBMI() {
    console.log('calculate BMI button clicked');
    if ($scope.user.units === 'Non-Metric') {
      $scope.BMI = ($scope.user.weight * 703)/Math.pow($scope.user.height,2);
    } else {
      $scope.BMI = ($scope.user.weight)/Math.pow($scope.user.height,2);
    }

    var totalCals = $scope.foods.reduce(function(acc, food) {
      return acc + (food.calServ * food.servings);
    }, 0);
    $scope.totalCals = totalCals;
    $scope.addedWeight = totalCals/3500;
  };

  $scope.editFood = function(food) {
    $scope.food = food;
  }

  $scope.removeFood = function(index) {
    console.log('remove food click', index);
    $scope.foods.$remove(index);

  };







}]);
