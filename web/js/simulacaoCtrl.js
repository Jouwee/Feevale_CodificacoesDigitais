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
    $scope.$watch(function() {return $rootScope.random.enabled; }, function(newValue, oldValue) {
        $scope.update();
    }, false);
    
    // Inicializa o período
    $scope.periodo = new Date('2015-04');
    $scope.pico = 0;
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
        $scope.horasProducaoPorCorrecao = $simulador.horasProducaoPorCorrecao;
        
        $scope.totalHorasDesenvolvimento = $scope.totalHorasDesenvolvimentoPorPeriodo[$scope.periodoFmt];
        

        $scope.relacaoRevisaoFichas = [];
        var relacaoRevisaoFichas = $simulador.getCurvaTempoRevisaoFichas($scope.pico);
        for(var i = 0; i < relacaoRevisaoFichas.length; i++) {
            $scope.relacaoRevisaoFichas.push(['Simulação', '% de fichas', '%', relacaoRevisaoFichas[i]]);
        }
        
        $scope.mediaRevisaoFichas = $scope.horasProducaoPorFicha + $simulador.getMediaRevisaoPorFicha($scope.relacaoRevisaoFichas);

        
        $scope.relacaoRevisaoIncidentes = [];
        var relacaoRevisaoIncidentes = $simulador.getCurvaTempoCorrecaoFichas($scope.pico);
        for(var i = 0; i < relacaoRevisaoIncidentes.length; i++) {
            $scope.relacaoRevisaoIncidentes.push(['Simulação', '% de correção', '%', relacaoRevisaoIncidentes[i]]);
        }
        
        $scope.mediaCorrecaoFichas = $scope.horasProducaoPorCorrecao + $simulador.getMediaCorrecaoPorFicha($scope.relacaoRevisaoFichas);
        
        
        $scope.totalHoras = $simulador.getHorasImplementacaoCorrecaoMensal($scope.totalHorasDesenvolvimento, relacaoRevisaoFichas, relacaoRevisaoIncidentes, $scope.mediaRevisaoFichas, $scope.mediaCorrecaoFichas);
        
        $scope.numeroImplementacoes = $scope.totalHoras.implementacao / $scope.mediaRevisaoFichas;
        $scope.numeroCorrecoes = $scope.totalHoras.correcao / $scope.mediaCorrecaoFichas    ;
        
    };
});

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}