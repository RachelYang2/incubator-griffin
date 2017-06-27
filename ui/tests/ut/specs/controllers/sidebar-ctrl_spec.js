/*-
 * Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

 */
define(['angular', 'angularMocks','angularRoute', 'js/controllers/sidebar-ctrl'],
  function(angular, mocks, sidebarCtrl) {
    describe('Test /js/controllers/sidebar-ctrl.js', function(){
      beforeEach(function(){
        module('app.controllers');
        module('app.services');
        module('app.filters');
        module('ngRoute');
      });
    	var $scope, $rootScope, $controller, $httpBackend, $config, $filter, $timeout, $compile ,$route;
      beforeEach(inject(function(_$controller_, _$httpBackend_, _$config_, _$filter_, _$timeout_, _$compile_, _$route_, _$rootScope_){
          $controller = _$controller_;
          $httpBackend = _$httpBackend_;
          $config = _$config_;
          $filter = _$filter_;
          $timeout = _$timeout_;
          $compile = _$compile_;
          $route = _$route_;
          $rootScope = _$rootScope_;
      }));

    	describe("http unit test",function(){
        // var $scope;
        beforeEach(function(){
          $scope =  $rootScope.$new();
          $controller('SideBarCtrl', {'$scope':$scope});
        })
        it('$scope.str works well', function(){
          // expect($scope.str).toEqual("hello");
        });
        it('url works well', function(){
          expect($config.uri.dashboard).toBeTruthy();
        });
        // it('function resizeSideChart() works well', function(){
        //   expect($scope.resizeSideChart).toBeDefined();
        // });
        describe("http get test",function(){
          beforeEach(function(){
                $httpBackend.when('GET', $config.uri.dashboard).respond(
                    {
                      "assets": 16,
                      "metrics": 20,
                      "status":{
                        "health": 16,
                        "warn": 3,
                        "invalid": 1
                      }
                    }
                );
                $httpBackend.flush();
          });

          // it("$scope.chartConfig is defined", function(){
          //     expect($scope.chartConfig).toBeDefined();
          // });

          afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
          });
        })


      })
    });
  }
)
