'use strict';
angular.module('mean.users')
  .controller('LoginCtrl', ['$scope', '$document', '$rootScope', '$http', '$location',
    function($scope, $document, $rootScope, $http, $location) {
      // This object will be filled by the form
      $scope.user = {};

      // Register the login() function
      $scope.login = function() {
        $http.post('/login', {
          email: $scope.user.email,
          password: $scope.user.password
        })
          .success(function(response) {
            // authentication OK
            $scope.loginError = 0;
            $rootScope.user = response.user;
            $rootScope.$emit('loggedin');
            if (response.redirect) {
              if (window.location.href === response.redirect) {
                //This is so an admin user will get full admin page
                window.location.reload();
              } else {
                window.location = response.redirect;
              }
            } else {
              $location.url('/');
            }
          })
          .error(function() {
            $scope.loginerror = 'Authentication failed.';
          });
      };
      $scope.forgotpw = function() {
        $http.post('/forgot-password', {
          text: $scope.text
        })
          .success(function(response) {
            $scope.response = response;
          })
          .error(function(error) {
            $scope.response = error;
          });
      };
    }
  ])
  .controller('RegisterCtrl', ['$scope', '$rootScope', '$http', '$location',
    function($scope, $rootScope, $http, $location) {
      $scope.user = {};

      $scope.register = function() {
        $scope.usernameError = null;
        $scope.registerError = null;
        $http.post('/register', {
          email: this.userEmail,
          password: this.pw1,
          confirmPassword: this.pw2, //need?
          username: this.userEmail, //need?
          name: this.userFirst + ' ' + this.userLast, //need?
		  birthday: this.userDOBmm + '/' + this.userDOBdd + '/' + this.userDOByyyy,
		  city: this.userCity,
		  drivingLevel: this.userSkillLvl,
		  emergencyContactName: this.emerFirst + ' ' + this.emerLast,
		  primaryEmergencyPhoneNumber: this.emerPhone,
		  primaryPhoneNumber: this.userPhone,
	  	  secondaryEmergencyPhoneNumber: this.emerPhone, //need?
		  //secondaryPhoneNumber: $scope.user.phone2, //need?
		  state: this.userState,
		  streetAddress: this.userAddr,
		  userFirstName: this.userFirst,
		  userLastName: this.userLast,
		  zip: this.userZip
        })
          .success(function() {
            // authentication OK
            $scope.registerError = 0;
            $http.post('/garage',{
                vehicleYear: $scope.vYear,
                vehicleMake: $scope.vMake,
                vehicleModel: $scope.vModel,
                vehicleColor: $scope.vColor
            });
            $rootScope.user = $scope.user;
            $rootScope.$emit('loggedin');
            $location.url('/');
          })
          .error(function(error) {
            // Error: authentication failed
            if (error === 'Username already taken') {
              $scope.usernameError = error;
            } else if (error === 'Email already taken') {
              $scope.emailError = error;
            } else $scope.registerError = error; $scope.next=false;
          });
      };
    }
  ])
  /*.controller('ForgotPWCtrl', ['$scope', '$rootScope', '$http', '$location',
    function($scope, $rootScope, $http, $location) {
      $scope.user = {};
      $scope.forgotpassword = function() {
        $http.post('/forgot-password', {
          text: $scope.text
        })
          .success(function(response) {
            $scope.response = response;
          })
          .error(function(error) {
            $scope.response = error;
          });
      };
    }
  ])*/
  .controller('ResetPasswordCtrl', ['$scope', '$rootScope', '$http', '$location', '$stateParams',
    function($scope, $rootScope, $http, $location, $stateParams) {
      $scope.user = {};
      $scope.resetpassword = function() {
        $http.post('/reset/' + $stateParams.tokenId, {
          password: $scope.user.password,
          confirmPassword: $scope.user.confirmPassword
        })
          .success(function(response) {
            $rootScope.user = response.user;
            $rootScope.$emit('loggedin');
            if (response.redirect) {
              if (window.location.href === response.redirect) {
                //This is so an admin user will get full admin page
                window.location.reload();
              } else {
                window.location = response.redirect;
              }
            } else {
              $location.url('/');
            }
          })
          .error(function(error) {
            if (error.msg === 'Token invalid or expired')
              $scope.resetpassworderror = 'Could not update password as token is invalid or may have expired';
            else
              $scope.validationError = error;
          });
      };
    }
  ]);