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
define(['angular', 'angularMocks','angularRoute', 'js/routes'],
  function(angular, mocks, filter) {

    describe('Test /js/routes.js', function() {
      beforeEach(module('ngRoute'));
      var location,route,rootScope;
      beforeEach(inject(function(_$location_,_$route_,_$rootScope_){
        location = _$location_;
        route = _$route_;
        rootScope = _$rootScope_;
      }));
      describe("health route",function(){
        beforeEach(inject(
          function($httpBackend){
            $httpBackend.expectGET('/health.html').respond(200,'health HTML');
          }));
        it('should load the health page on successful load of/health',function(){
          expect(route.current).toBeUndefined();
          location.path('/health');
          // expect(route).toBe('...');
          rootScope.$digest();
          expect(location.path()).toBe('/health');
          // expect(route.routes['/health'].controller).toBe('HealthCtrl');
          // expect(route.routes['/health']).toBe('..');
          // expect(route.current.controller).toBe('HealthCtrl');
        });
      });

      describe("Measure route",function(){
        beforeEach(inject(
          function($httpBackend){
            $httpBackend.expectGET('/measures.html').respond(200,'measures HTML');
          }));
        it('should load the measures page on successful load of/measures',function(){
          expect(route.current).toBeUndefined();
          location.path('/measures');
          // expect(route).toBe('...');
          rootScope.$digest();
          expect(location.path()).toBe('/measures');
          // expect(route.routes['/health'].controller).toBe('HealthCtrl');
          // expect(route.routes['/health']).toBe('..');
          // expect(route.current.controller).toBe('HealthCtrl');
        });
      });

      describe("Jobs route",function(){
        beforeEach(inject(
          function($httpBackend){
            $httpBackend.expectGET('/jobs.html').respond(200,'jobs HTML');
          }));
        it('should load the jobs page on successful load of/jobs',function(){
          expect(route.current).toBeUndefined();
          location.path('/jobs');
          // expect(route).toBe('...');
          rootScope.$digest();
          expect(location.path()).toBe('/jobs');
          // expect(route.routes['/health'].controller).toBe('HealthCtrl');
          // expect(route.routes['/health']).toBe('..');
          // expect(route.current.controller).toBe('HealthCtrl');
        });
      });

    });
  }
);
