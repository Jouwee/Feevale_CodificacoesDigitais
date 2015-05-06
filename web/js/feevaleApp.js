var feevaleApp = angular.module('feevaleApp', ['ngRoute', 'ui.bootstrap']);

/* ------------------------------------------------------------------------------------------------------------------ */
// Rotas
/* ------------------------------------------------------------------------------------------------------------------ */
feevaleApp.config(function($routeProvider) {
    $routeProvider
            // Página inicial
            .when('/', {
                templateUrl: 'views/historico.html',
                controller: 'historicoCtrl'
            })
            // route for the about page
            .when('/historico', {
                templateUrl: 'views/historico.html',
                controller: 'historicoCtrl'
            });
});

/* ------------------------------------------------------------------------------------------------------------------ */
// Diretivas
/* ------------------------------------------------------------------------------------------------------------------ */
feevaleApp.directive('appNavbar', function() {
    return {
        templateUrl: 'tpl/appNavbar.html'
    };
}).directive('appChart', function() {
    var chartId = 1;
    return {
        scope: {
            data: '=',
            min: '=',
            max: '=',
            type: '@',
            title: '@',
            xAxis: '@',
            yAxis: '@',
            notes: '@'
        },
        link: function($scope) {
            $scope.chartId = chartId++;
        },
        controller: function($scope) {
           $scope.$watch('data', function(newValue, oldValue) {
                var modelHash = {};
                for(var i in $scope.data) {
                    var model = $scope.data[i][0];
                    var series = $scope.data[i][1];
                    var x = $scope.data[i][2];
                    var y= $scope.data[i][3];
                    if (modelHash[model] === undefined) {
                        modelHash[model] = {};
                        modelHash[model].name = model;
                        modelHash[model].seriesHash = {};
                    }
                    var seriesHash = modelHash[model].seriesHash;
                    if (seriesHash[series] === undefined) {
                        seriesHash[series] = {};
                        seriesHash[series].name = series;
                        seriesHash[series].data = [];
                    }
                    seriesHash[series].data.push({name: x, y:parseFloat(y)});
                }
                
                var theSeries = [];
                for(var i in modelHash) {
                    for(var j in modelHash[i].seriesHash) {
                        theSeries.push(modelHash[i].seriesHash[j]);
                    }
                }
                var options = {
                    title: {
                        text: '',
                        style: 'display : none'
                    },
                    xAxis: {
                        type: 'category',
                        title: {
                            text: $scope.xAxis
                        }
                    },
                    yAxis: {
                        title: {
                            text: $scope.yAxis
                        }
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal'
                        }
                    },
                    series: theSeries
                };
                if ($scope.type === 'column') {
                    $.extend( options, {
                        chart: {
                            type: 'column'
                        }
                    });
                }
                if ($scope.type === 'gauge') {
                    $.extend( options, {
                        chart: {
                            type: 'pie'
                        },
                        plotOptions: {
                            pie: {
                                innerSize: '50%',
                                dataLabels: {
                                    enabled: true,
                                    distance: 0,
                                },
                                startAngle: -90,
                                endAngle: 90,
                                center: ['50%', '75%']
                            }
                        },
                    });
                }
                if ($scope.type === 'solidgauge') {
                    $.extend( options, {
                        chart: {
                            type: 'solidgauge'
                        },
                        pane: {
                            center: ['50%', '85%'],
                            size: '140%',
                            startAngle: -90,
                            endAngle: 90,
                            background: {
                                /*backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                                innerRadius: '60%',
                                outerRadius: '100%',*/
                                shape: 'arc'
                            }
                        },
                        yAxis: {
                            min: $scope.min,
                            max: $scope.max,
                        }
                    });
                }
                $('div#chart' + $scope.chartId).highcharts(options);
            });
        },
        templateUrl: 'tpl/appChart.html'
    };
});

/* ------------------------------------------------------------------------------------------------------------------ */
// Serviços
/* ------------------------------------------------------------------------------------------------------------------ */
feevaleApp.factory('$dataProvider', function($http) {
    var dataProviderService = {};
    //  Lê uma view
    dataProviderService.readView = function(viewName, where, onSuccess) {
        $http.get('data?view='+viewName+'&where='+where).success(function(data) {
            onSuccess(data);
        });
    };
    return dataProviderService;
});