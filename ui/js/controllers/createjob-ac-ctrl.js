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


define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('CreateJobACCtrl', ['$scope', '$http', '$config', '$location', 'toaster', '$route', function ($scope, $http, $config, $location, toaster, $route) {
        console.log('Create job controller');
        $scope.currentStep = 1;
        $scope.Times = ['seconds', 'minutes', 'hours'];
        $scope.timeType = 'seconds';
        $scope.Measures = [];

        function resizeWindow() {
            var stepSelection = '.formStep[id=step-' + $scope.currentStep + ']';
            $(stepSelection).css({
                height: window.innerHeight - $(stepSelection).offset().top - $('#footerwrap').outerHeight()
            });
            $('fieldset').height($(stepSelection).height() - $(stepSelection + '>.stepDesc').height() - $('.btn-container').height() - 80);
            $('.y-scrollable').css({
                'max-height': $('fieldset').height() - $('.add-dataset').outerHeight()
            });
        }

        $scope.$on('$viewContentLoaded', function () {
            $scope.$emit('initReq');
            resizeWindow();
        });
        var getMeasureUrl = $config.uri.getMeasuresByOwner + $scope.ntAccount;
        $http.get(getMeasureUrl).then(function successCallback(res) {
            angular.forEach(res.data, function (measure) {
                $scope.Measures.push(measure);
            });
            $scope.measure = 0;
        });

        $scope.$on('resizeHandler', function () {
            if ($route.current.$$route.controller === "CreateRuleACCtrl") {
                $scope.$emit('initReq');
                resizeWindow();
            }
        });

        var errorMessage = function (i, msg) {
            var errorMsgs = ['Please complete the form!', 'please complete the form in this step before proceeding'];
            if (!msg) {
                toaster.pop('error', 'Error', errorMsgs[i - 1], 0);
            } else {
                toaster.pop('error', 'Error', msg, 0);
            }
        };

        // Initial Value
        $scope.form = {
            prev: function (form) {
                history.back();
            },
            submit: function (form) {
                if (!form.$valid) {
                    var field = null, firstError = null;
                    for (field in form) {
                        if (field[0] !== '$') {
                            if (firstError === null && !form[field].$valid) {
                                firstError = form[field].$name;
                            }
                            if (form[field].$invalid) {
                                form[field].$dirty = true;
                            }
                        }
                    }
                    angular.element('.ng-invalid[name=' + firstError + ']').focus();
                    errorMessage($scope.currentStep);
                } else {
                    form.$setPristine();
                    var period;
                    if ($scope.timeType === 'minutes') {
                        period = $scope.periodTime * 60;
                    } else if ($scope.timeType === 'hours') {
                        period = $scope.periodTime * 3600;
                    } else {
                        period = $scope.periodTime;
                    }
                    var startTime = '';
                    var year = $scope.jobStartTime.substr(0, 4);
                    var month = $scope.jobStartTime.substr(4, 2);
                    var day = $scope.jobStartTime.substr(6, 2);
                    startTime = year + '-' + month + '-' + day + ' ' + $scope.jobStartTime.split(' ')[1];
                    startTime = Date.parse(startTime);

                    if (isNaN(startTime)) {
                        toaster.pop('error', 'Please input the right format of start time');
                        return;
                    }
                    this.data = {
                        sourcePat: $scope.sourcePat,
                        targetPat: $scope.targetPat,
                        jobStartTime: startTime,
                        periodTime: period,
                        groupName: 'BA'
                    };
                    $('#confirm-job').modal('show');
                }
            },

            save: function () {
                var date = new Date();
                // var month = date.getMonth()+1;
                var timestamp = Date.parse(date);
                timestamp = timestamp / 1000;
                var time = date.toDateString() + ' ' + date.toLocaleTimeString();
                var jobName = $scope.Measures[$scope.measure] + '-BA-' + $scope.ntAccount + '-' + time;
                var newJob = $config.uri.addJobs + this.data.groupName + '/' + jobName + '/' + $scope.Measures[$scope.measure];
                $http.post(newJob, this.data).then(function successCallback(data) {
                    $('#confirm-job').on('hidden.bs.modal', function () {
                        $('#confirm-job').off('hidden.bs.modal');
                        $location.path('/jobs').replace();
                        $scope.$apply();
                    });
                    $('#confirm-job').modal('hide');
                }, function errorCallback(response) {
                    toaster.pop('error', 'Error when creating job', response.message);
                });
            }
        };
    }]);
});
