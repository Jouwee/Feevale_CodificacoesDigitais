var feevaleApp = angular.module('feevaleApp', ['ngRoute']);

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
                    seriesHash[series].data.push({name: x, y:parseInt(y)});
                }
                
                var theSeries = [];
                for(var i in modelHash) {
                    for(var j in modelHash[i].seriesHash) {
                        theSeries.push(modelHash[i].seriesHash[j]);
                    }
                }
                $('div#chart' + $scope.chartId).highcharts({
                    chart: {
                        type: 'column'
                    },
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
                });
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
    dataProviderService.readView = function(viewName, onSuccess) {
        $http.get('data?view='+viewName).success(function(data) {
            onSuccess(data);
        });
    };
    return dataProviderService;
});