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
    controllers.controller('CreateDataAssetCtrl', ['$scope', '$http', '$config', '$location', 'toaster', '$route', '$filter', function ($scope, $http, $config, $location, toaster, $route, $filter) {
        $scope.currentStep = 1;
        $scope.assetTypeOptions = ['hivetable'];
        $scope.formatTypeOptions = ['yyyyMMdd', 'yyyy-MM-dd', 'HH'];

        $scope.regex = '^\\/(?:[0-9a-zA-Z\\_\\-\\.]+\\/?)+';

        var allModels = $config.uri.dbtree;
        $http.get(allModels).then(function successCallback(data) {
            $scope.platformOptions = data.data;
        });

        $scope.systemOptions = $filter('strarr')('modelsystem'); //['Bullseye', 'GPS', 'Hadoop', 'PDS', 'IDLS', 'Pulsar', 'Kafka'];
        $scope.updateHdfsPath = function (typeIndex) {
            if (typeIndex !== 0) {
                $scope.form.basic.path = '';
            }
        };

        $scope.addSchema = function () {
            $scope.form.basic.schema.push({
                name: '',
                type: 'string',
                desc: '',
                sample: ''
            });
        };

        $scope.addPatitionColumn = function () {
            $scope.form.basic.partitions.push({
                name: '',
                format: "yyyyMMdd"
            });
        };

        $scope.deleteSchema = function (index) {
            $scope.form.basic.schema.splice(index, 1);
        };

        $scope.deletePartition = function (index) {
            $scope.form.basic.partitions.splice(index, 1);
        };

        function resizeWindow() {
            $('.formStep').height(window.innerHeight - $('.formStep').offset().top - $('#footerwrap').outerHeight() - 20);
            $('fieldset').height(window.innerHeight - $('fieldset').offset().top - $('#footerwrap').outerHeight() - $('.btn-container').height() - 80);
            $('.y-scrollable').css({
                'max-height': $('fieldset').height()
            });
        }

        $scope.$on('$viewContentLoaded', function () {
            $scope.$emit('initReq');
            resizeWindow();
        });

        $scope.$on('resizeHandler', function () {
            if ($route.current.$$route.controller === "CreateDataAssetCtrl") {
                resizeWindow();
            }
        });

        var errorMessage = function (i, msg) {
            var errorMsgs = ['Please input valid values'];
            if (!msg) {
                toaster.pop('error', 'Error', errorMsgs[i - 1], 0);
            } else {
                toaster.pop('error', 'Error', msg, 0);
            }
        };

        // Initial Value
        $scope.form = {
            basic: {
                platform: 'Apollo',
                schema: [{
                    name: '',
                    type: 'string',
                    desc: '',
                    sample: ''
                }],
                partitions: []
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
                    this.data = {
                        basic: this.basic
                    };
                    this.data.basic.path += this.data.basic.path.substring(this.data.basic.path.length - 1) === "/"
                        ? ''
                        : '/';
                    $('#confirm-pu').modal('show');
                }
            },

            save: function () {
                var msg = {
                    system: $scope.systemOptions[$scope.form.basic.system],
                    assetType: $scope.assetTypeOptions[$scope.form.basic.type],
                    assetName: $scope.form.basic.assetName,
                    assetHDFSPath: $scope.form.data.basic.path + ($scope.form.data.basic.folderFormat === undefined
                        ? ""
                        : $scope.form.data.basic.folderFormat),
                    platform: $scope.form.basic.platform,
                    schema: $scope.form.basic.schema,
                    partitions: $scope.form.basic.partitions,
                    owner: $scope.form.basic.owner
                };

                $http.post($config.uri.adddataasset, msg).then(function successCallback() {
                    $('#confirm-pu').on('hidden.bs.modal', function () {
                        $('#confirm-pu').off('hidden.bs.modal');
                        $location.path('/dataassets');
                        $scope.$apply();
                    });
                    $('#confirm-pu').modal('hide');
                }, function errorCallback(response) {
                    toaster.pop('error', 'Error when creating dataasset', response.message);
                });
            }
        };

    }]);
});