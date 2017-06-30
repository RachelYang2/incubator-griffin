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
define(['require', 'angular', 'angularMocks', 'js/controllers/health-ctrl', 'echarts', 'js/services/bark-chart'],
function(require, angular, mocks, HealthCtrl) {
    describe('Test /js/controllers/health-ctrl.js',
    function() {
        beforeEach(function() {
            module('app.controllers');
            module('app.services');
            module('app.filters');
        });
        var $scope, $rootScope, $controller, $httpBackend, $config, $location, toaster, $timeout, $route, $barkChart;

        beforeEach(inject(function(_$rootScope_, _$controller_, _$httpBackend_, _$config_, _$location_, _$timeout_, _$barkChart_) {
            $rootScope = _$rootScope_;
            $controller = _$controller_;
            $httpBackend = _$httpBackend_;
            $config = _$config_;
            $location = _$location_;
            $timeout = _$timeout_;
            toaster = {};
            $route = {};
            $barkChart = _$barkChart_;
        }));

        beforeEach(function() {
            $scope = $rootScope.$new();
            controller = $controller('HealthCtrl', {
                $scope: $scope,
                $route: $route,
                toaster: toaster,
                $barkChart: $barkChart
            });
        });

        describe("if the controller of HealthCtrl exists",
        function() {
            it('controller exists',
            function() {
                expect(controller).toBeDefined();
            });
        })

        describe("check if parameters are available",
        function() {

            it('$scope.value and $config.value should be right',
            function() {
                expect($config.uri.dashboard).toBeTruthy();
            });

        })

        describe("httpGet $config.uri.dashboard test",
        function() {
            beforeEach(function() {
                $httpBackend.when('POST', $config.uri.dashboard).respond({
                    "hits": {
                        "hits": [{
                            "_source": {
                                "name": "buy_hourly",
                                "tmst": 1493951823461,
                                "total": 23224,
                                "matched": 23028
                            }
                        },
                        {
                            "_source": {
                                "name": "search_hourly",
                                "tmst": 1493951823461,
                                "total": 1067347,
                                "matched": 1067346
                            }
                        },
                        ]
                    }
                });
                $httpBackend.when('GET', $config.uri.organization).respond({
                    "griffin": ["buy_hourly"]
                });
                $httpBackend.flush();

            });

            it('http response',
            function() {

                // $scope.$on('$viewContentLoaded',function(){
                //   		$scope.pageInit();
                //   		$httpBackend.flush();
                // });
            });

            afterEach(function() {
                // $httpBackend.verifyNoOutstandingExpectation();
                // $httpBackend.verifyNoOutstandingRequest();
            });
        })

    });
})