feevaleApp.controller('simulacaoCtrl', function ($rootScope, $scope, $simulador, $random) {
    $rootScope.pagina = 'simulacao';
    $scope.$watch(function() {return $scope.periodo; }, function(newValue, oldValue) {
        $scope.update();
    }, false);
    $scope.$watch(function() {return $scope.pico; }, function(newValue, oldValue) {
        $scope.update();
    }, false);
    $scope.$watch(function() {return $rootScope.random.seed; }, function(newValue, oldValue) {
        $scope.update();
    }, false);
    
    // Inicializa o período
    $scope.periodo = new Date('2015-04');
    $scope.pico = 1;
    $scope.update = function() {
        
        $random.reset();
        
        // Gráficos NÃO dependentes do período
        $scope.incidenciaErros = [];
        $scope.totalHorasDesenvolvimentoPorPeriodo = [];
        var mes = 0;
        var ano = 2013;
        while(true) {
            mes++;
            if (mes > 12) {
                mes = 1;
                ano++;
            }
            var horas = $simulador.getTotalHoras(ano, mes);
            $scope.totalHorasDesenvolvimentoPorPeriodo[ano + '-' + pad(mes, 2)] = horas;
            $scope.incidenciaErros.push(['Simulação', 'Total horas', pad(mes, 2) + '-' + ano, horas]);
            if (ano === 2015 && mes > 5) {
                break;
            }
        }
        var monthIndex = $scope.periodo.getMonth();
        var year = $scope.periodo.getFullYear();
        
        
        $scope.periodoFmt = year + "-" + pad((monthIndex + 1), 2);
        $scope.periodoExtenso = $rootScope.monthNames[monthIndex] + ' de ' + year;
        $scope.horasProducaoPorFicha = $simulador.horasProducaoPorFicha;
        
        $scope.totalHorasDesenvolvimento = $scope.totalHorasDesenvolvimentoPorPeriodo[$scope.periodoFmt];
        
        /*
        // Gráficos dependentes do período
        $dataProvider.readView('V_CHART_CLASSIF_INCIDENTES', 'PERIODO = \'' + $scope.periodoFmt + '\'', function(data) {
            $scope.classificacaoIncidentes = data;
        });
        $dataProvider.readView('V_CHART_TOTAL_HORAS_IMPLEM', 'PERIODO = \'' + $scope.periodoFmt + '\'', function(data) {
            $scope.totalHorasImplementacao = data;
        });
        $dataProvider.readView('V_CHART_TOTAL_HORAS_INCID', 'PERIODO = \'' + $scope.periodoFmt + '\'', function(data) {
            $scope.totalHorasIncidentes = data;
        });
        $dataProvider.readView('V_CHART_RELACAO_REVISAO_INCID', 'PERIODO = \'' + $scope.periodoFmt + '\'', function(data) {
            $scope.relacaoRevisaoIncidentes = data;
        });
        */
        $scope.relacaoRevisaoFichas = [];
        var relacaoRevisaoFichas = $simulador.getCurvaTempoRevisaoFichas($scope.pico);
        for(var i = 0; i < relacaoRevisaoFichas.length; i++) {
            $scope.relacaoRevisaoFichas.push(['Simulação', 'Número de fichas', '%', relacaoRevisaoFichas[i]]);
        }
        
        $scope.mediaRevisaoFichas = $simulador.getMediaRevisaoPorFicha($scope.relacaoRevisaoFichas);
        
        /*
        $scope.totalFichas = 110;
        $scope.totalFichasImplementacao = 110;
        $dataProvider.readRecord('SELECT COUNT(*) FROM V_FICHAS WHERE TIPO IN (1, 3) AND TO_CHAR(DATACRIACAO, \'YYYY-MM\') = \'' + $scope.periodoFmt + '\'', function(data) {
            $scope.totalFichasIncidentes = data[0];
            $dataProvider.readRecord('SELECT SUM(HORAS) FROM V_HORAS WHERE TIPO = \'Correção\' AND PERIODO = \'' + $scope.periodoFmt + '\'', function(data) {
                $scope.mediaHorasIncidente = (data[0] / $scope.totalFichasIncidentes).toFixed(2);
            });
        });
        $scope.totalHoras = Math.floor(((Math.abs(Math.sin(monthIndex + 1 / 4)) * 0.6) + 0.6) * 2360);
        */
    }
});

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}