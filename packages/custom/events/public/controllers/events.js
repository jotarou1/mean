'use strict';


angular.module('mean.events').controller('EventsController', ['$scope', '$stateParams', '$location', 'Global', 'Events', 'Tracks', '$http',
  function($scope, $stateParams, $location, Global, Events, Tracks, $http) {
    $scope.global = Global;

    /*$scope.hasAuthorization = function(event) {
      if (!event || !event.user) return false;
      return $scope.global.isAdmin || event.user._id === $scope.global.user._id;
    };*/

    $scope.advanced = 20;
    $scope.intermediate = 20;
    $scope.novice = 20;

    $scope.parentScope = {};

    $scope.findTrackById = function(event) {
      $http.get('/tracks/'+event.trackId)
          .success(
          function (tracks) {
            if (tracks) {
              console.log(tracks);
              event.track = tracks;
            }
          }
      );
    };

    $scope.create = function(isValid) {
      if (isValid) {
        var event = new Events({
          advancedCap: this.advanced,
          albumLink: this.fblink,
          //albumLink2: this.glink,
          basePrice: this.evPrice,
          eventDesc: this.evDesc,
          eventStartDate: this.evDate,
          intermediateCap: this.intermediate,
          noviceCap: this.novice,
          trackID: this.parentScope.evTrack
        });
        event.$save(function(response) {
          $location.path('events/' + response._id);
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.remove = function(event) {
      if (event) {
        event.$remove();

        for (var i in $scope.events) {
          if ($scope.events[i] === event) {
            $scope.events.splice(i, 1);
          }
        }
      } else {
        $scope.event.$remove(function(response) {
          $location.path('events');
        });
      }
    };

    $scope.update = function(isValid) {
      if (isValid) {
        var event = $scope.event;
        if (!event.updated) {
          event.updated = [];
        }
        event.updated.push(new Date().getTime());

        event.$update(function() {
          $location.path('events/' + event._id);
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.find = function() {
      Events.query(function(events) {
          //console.log(events);
          $scope.events = events;
          for (var i=0; i < events.length;i = i+1) {
              console.log(events[i]);
            if ($scope.events[i].trackId !== undefined)
              $scope.findTrackById($scope.events[i]);
          }
      });
    };

    $scope.findOne = function() {
      Events.get({
        eventId: $stateParams.eventId
      }, function(event) {
        $scope.event = event;
      });
    };

    $scope.showEvent = function(event) {
      $location.path('/events/' + event._id);
    };
  }
]).filter('filterUpcoming', function() {
  return function(items) {
    var upcoming = [];

    angular.forEach(items, function(item){
      if ( new Date() <= new Date(item.eventStartDate) ) {
        upcoming.push(item);
      }
    });

    return upcoming;
  };
}).filter('filterPast', function() {
    return function(items) {
        var past = [];

        angular.forEach(items, function(item){
          if ( new Date() > new Date(item.eventStartDate) ) {
                past.push(item);
            }
        });

        return past;
    };
});
