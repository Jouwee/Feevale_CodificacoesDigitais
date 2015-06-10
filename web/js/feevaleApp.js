var feevaleApp = angular.module('feevaleApp', ['ngRoute', 'ui.bootstrap']);

/* ------------------------------------------------------------------------------------------------------------------ */
// Rotas
/* ------------------------------------------------------------------------------------------------------------------ */
feevaleApp.config(function ($routeProvider) {
    $routeProvider
            // Página inicial
            .when('/', {
                templateUrl: 'views/apresentacao.html',
                controller: 'apresentacaoCtrl'
            })
            // Apresentação
            .when('/apresentacao', {
                templateUrl: 'views/apresentacao.html',
                controller: 'apresentacaoCtrl'
            })
            // Histórico
            .when('/historico', {
                templateUrl: 'views/historico.html',
                controller: 'historicoCtrl'
            })
            // Projeção
            .when('/projecao', {
                templateUrl: 'views/projecao.html',
                controller: 'projecaoCtrl'
            })
            // Projeção
            .when('/simulacao', {
                templateUrl: 'views/simulacao.html',
                controller: 'simulacaoCtrl'
            })
            ;
});

/* ------------------------------------------------------------------------------------------------------------------ */
// Diretivas
/* ------------------------------------------------------------------------------------------------------------------ */
feevaleApp.directive('appNavbar', function () {
    return {
        templateUrl: 'tpl/appNavbar.html'
    };
}).directive('appChart', function () {
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
        link: function ($scope) {
            $scope.chartId = chartId++;
            $scope.$watch('data', function (newValue, oldValue) {
                var modelHash = {};
                for (var i in $scope.data) {
                    var model = $scope.data[i][0];
                    var series = $scope.data[i][1];
                    var x = $scope.data[i][2];
                    var y = $scope.data[i][3];
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
                    seriesHash[series].data.push({name: x, y: parseFloat(y)});
                }

                var theSeries = [];
                for (var i in modelHash) {
                    for (var j in modelHash[i].seriesHash) {
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
                    $.extend(options, {
                        chart: {
                            type: 'column'
                        }
                    });
                }
                if ($scope.type === 'gauge') {
                    $.extend(options, {
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
                    $.extend(options, {
                        chart: {
                            type: 'solidgauge'
                        },
                        pane: {
                            center: ['50%', '85%'],
                            size: '140%',
                            startAngle: -90,
                            endAngle: 90,
                            background: {
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
feevaleApp.factory('$dataProvider', function ($http) {
    var dataProviderService = {};
    //  Lê uma view
    dataProviderService.readView = function (viewName, where, onSuccess) {
        $http.get('data?view=' + viewName + '&where=' + where).success(function (data) {
            onSuccess(data);
        });
    };
    //  Lê um registro
    dataProviderService.readRecord = function (select, onSuccess) {
        $http.get('data?query=' + select).success(function (data) {
            onSuccess(data[0]);
        });
    };
    return dataProviderService;
})

// Gerador aleatório        
.factory('$random', function () {
    var random = {};
    //  Lê uma view
    random.getFunctionPoint = function (theFunction, x, deviation) {
        var randomDeviation = (Math.random() * deviation);
        return theFunction(x) * (1 - (deviation / 2) + randomDeviation);
    };
    return random;
})

// Gerador de dados do modelo
.factory('$simulador', function ($random) {
    var simulador = {};
    // Gera
    simulador.getTotalHoras = function (ano, mes) {
        // O desvio padrão deveria ser 20%, mas 50% parece mais preciso
        //var deviation = 0.2;
        var deviation = 0.5;
        var formula = function (x) {
            return ((Math.abs(Math.sin(x / 4)) * 0.6) + 0.6) * 2360;
        };
        return Math.floor($random.getFunctionPoint(formula, mes, deviation));
    };
    // Gera
    simulador.getCurvaTempoRevisaoFichas = function (pico) {
        var curva = [];
        var soma = 0;
        
        var numeroItens = pico;
        for (var i = 0; i < numeroItens; i++) {
            curva[i] = (i + 1) / numeroItens;
        }
        
        var numeroItens = 9 - pico;
        for (var i = 0; i < numeroItens; i++) {
            curva[(pico - i) + numeroItens - 1] = (i) / numeroItens;
        }
        
        for(var i = 0; i < 10; i++) {
            soma += curva[i] == undefined ? 0 : curva[i];
        }
        for(var i = 0; i < 10; i++) {
            curva[i] = curva[i] / soma;
        }
        return curva;
    };
    return simulador;
});

