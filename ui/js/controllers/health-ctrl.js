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
    controllers.controller('HealthCtrl', ['$scope', '$http', '$config', '$location','$timeout', '$route', '$barkChart', '$rootScope', function ($scope, $http, $config, $location, $timeout, $route, $barkChart, $rootScope) {
      console.log('health controller');
      // var url="/js/controllers/heatmap.json";

        var echarts = require('echarts');
        var formatUtil = echarts.format;
       
        $scope.$on('$viewContentLoaded',function(){
            $scope.pageInit();
        });


        $scope.orgs = [];
        $scope.dataData = [];
        $scope.finalData = [];
        $scope.pageInit = function () {
            $scope.$emit('initReq');

//            var url = $config.uri.heatmap;
            var url_dashboard = $config.uri.dashboard ;
            // var url_dashboard = './data.json';
            var url_organization = $config.uri.organization;
            // var url_organization = './org.json';
            $http.get(url_organization).then(function successCallback(res){
               var orgNode = null;
               angular.forEach(res.data, function(value,key) {
                    orgNode = new Object();
                    $scope.orgs.push(orgNode);
                    orgNode.name = key;
                    orgNode.assetMap = value;
               });
               $scope.originalOrgs = angular.copy($scope.orgs);
                // $http.post(url_dashboard, {"query": {"match_all":{}},  "sort": [{"tmst": {"order": "asc"}}],"size":1000}).success(function(data) {
                 $http.get(url_dashboard).then(function successCallback(response){
                    angular.forEach(response.data.hits.hits, function(sys) {
                        var chartData = sys._source;
                        chartData.sort = function(a,b){
                            return a.tmst - b.tmst;
                        }
                    });
                    $scope.originalData = angular.copy(response.data);

                    $scope.myData = angular.copy($scope.originalData.hits.hits);
                    $scope.metricName = [];
                    for(var i = 0;i<$scope.myData.length;i++){
                        $scope.metricName.push($scope.myData[i]._source.name);
                    }
                    $scope.metricNameUnique = [];
                    angular.forEach($scope.metricName,function(name){
                        if($scope.metricNameUnique.indexOf(name) === -1){
                            $scope.dataData[$scope.metricNameUnique.length] = new Array();
                            $scope.metricNameUnique.push(name);
                        }
                    });

                    for(var i = 0;i<$scope.myData.length;i++){
                        for(var j = 0 ;j<$scope.metricNameUnique.length;j++){
                            if($scope.myData[i]._source.name==$scope.metricNameUnique[j]){
                                $scope.dataData[j].push($scope.myData[i]);
                            }
                        }
                    }
                    angular.forEach($scope.originalOrgs,function(sys,parentIndex){
                        var node = null;
                        node = new Object();
                        node.name = sys.name;
                        node.dq = 0;
                        node.metrics = new Array();
                        angular.forEach($scope.dataData,function(metric,index){
                            if(sys.assetMap.indexOf(metric[metric.length-1]._source.name)!= -1){
                                var metricNode = new Object();
                                metricNode.name = metric[metric.length-1]._source.name;
                                metricNode.timestamp = metric[metric.length-1]._source.tmst;
                                metricNode.dq = metric[metric.length-1]._source.matched/metric[metric.length-1]._source.total*100;
                                metricNode.details = new Array();
                                node.metrics.push(metricNode);
                            }
                        })
                        $scope.finalData.push(node);
                    })
                    $scope.originalData = angular.copy($scope.finalData);
                    renderTreeMap($scope.finalData);
                });

            });
//            $http.get(url).success(function(res) {
//                renderTreeMap(res);
//            });
        }

        function renderTreeMap(res) {
                function parseData(data) {
                    var sysId = 0;
                    var metricId = 0;
                    var result = [];
                    angular.forEach(res,function(sys,key){
                        console.log(sys);

                        var item = {};
                        item.id = 'id_'+sysId;
                        item.name = sys.name;

                        if (sys.metrics != undefined) {
                            item.children = [];
                            angular.forEach(sys.metrics,function(metric,key){
                                var timestamp = new Date(metric.timestamp);
                                // var h = timestamp.getHours();
                                // var min = timestamp.getMinutes();
                                // var s = timestamp.getSeconds();
                                var hour = timestamp.getHours() < 10 ? '0' + timestamp.getHours() : timestamp.getHours();
                                var min = timestamp.getMinutes() < 10 ? '0' + timestamp.getMinutes() : timestamp.getMinutes(); 
                                var sec = timestamp.getSeconds() < 10 ? '0' + timestamp.getSeconds() : timestamp.getSeconds();
                                var y = timestamp.getFullYear();
                                var m = timestamp.getMonth()+1;
                                var d = timestamp.getDate();
                                timestamp = m + '/' + d + '/' + y + ' ' + hour + ':' + min + ':' + sec;
                                var itemChild = {
                                    id: 'id_' + sysId + '_' + metricId,
                                    name: metric.name,// + '(' + metric.dq + '%)',
                                    // value: metric.dq,
                                    value: 1,
                                    dq: metric.dq,
                                    sysName: sys.name,
                                    timestamp:timestamp,
                                    itemStyle: {
                                        normal: {
                                            color: '#4c8c6f'
                                        }
                                    },
                                    // link:'/#/detailed/'+metric.name,
                                    // target:'self',
                                };
                                if (metric.dqfail == 1) {
                                    itemChild.itemStyle.normal.color = '#E45A51';
                                } else {
                                    itemChild.itemStyle.normal.color = '#29C39C';
                                }
                                item.children.push(itemChild);
                                metricId++;
                            });
                        }

                        result.push(item);

                        sysId ++;
                    });
                    return result;
                }

                var data = parseData(res);
                console.log(data);

                function getLevelOption() {
                    return [
                        {
                            itemStyle: {
                                normal: {
                                    borderWidth: 0,
                                    gapWidth: 6,
                                    borderColor: '#000'
                                }
                            }
                        },

                        {
                            itemStyle: {
                                normal: {
                                    gapWidth: 1,
                                    borderColor: '#fff'
                                }
                            }
                        }
                    ];
                }

                var option = {

                    title: {
                        show:false,
                        // text: 'Data Quality Metrics Heatmap',
                        // left: 'center',
                        // textStyle:{
                        //     color:'white'
                        // },
                        // subtext:'Healthy Unhealthy'
                    },

                    backgroundColor: 'transparent',

                    tooltip: {
                        formatter: function(info) {
                            var dqFormat = info.data.dq>100?'':'%';
                            return [
                            '<span style="font-size:1.5em;">' + formatUtil.encodeHTML(info.data.name)+' &gt; </span>',
                                '<span style="font-size:1.8em;">' + formatUtil.encodeHTML(info.data.sysName) + '</span><br>',
                                '<span style="font-size:1.5em;font-weight:bold">DQ : ' + info.data.dq.toFixed(2) + dqFormat + '</span><br>',
                                '<span style="font-size:1.5em;">Time: '+formatUtil.encodeHTML(info.data.timestamp)+'</span>'
                            ].join('');
                        },
                        backgroundColor:'rgba(212,216,219,0.7)',
                        padding:10,
                        textStyle:{
                            color:'#959595'
                        }
                    },

                    series: [
                        {
                            name:'System',
                            type:'treemap',
                            itemStyle: {
                                normal: {
                                    borderColor: '#fff'
                                }
                            },
                            levels: getLevelOption(),
                            breadcrumb: {
                                show: false
                            },
                            roam: false,
                            nodeClick: 'link',
                            data: data,
                            // leafDepth: 1,
                            width: '95%',
                            bottom : 0
                        }
                    ]
                };

                resizeTreeMap();
                $scope.myChart = echarts.init(document.getElementById('chart1'), 'dark');
                $scope.myChart.setOption(option);

                $scope.myChart.on('click', function(param) {
                    // if (param.data.sysName) {
                    //     $location.path('/metrics/' + param.data.sysName);
                    //     $scope.$apply();
                    //     return false;
                    // }
                    // param.event.event.preventDefault();
                    if (param.data.name) {
                        // $location.path('/detailed/'+param.data.name);
                        window.location.href = '/#/detailed/'+param.data.name;
                    }
                });

        }

        $scope.$on('resizeHandler', function(e) {
            if($route.current.$$route.controller == 'HealthCtrl'){
                console.log('health resize');
                resizeTreeMap();
                $scope.myChart.resize();
            }
        });

        function resizeTreeMap() {
            $('#chart1').height( $('#mainWindow').height() - $('.bs-component').outerHeight() - 45 );
        }

    }]);
});
