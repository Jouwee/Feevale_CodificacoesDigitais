feevaleApp.controller('projecaoCtrl', function ($scope, $dataProvider) {
    $scope.$watch(function() {return $scope.periodo}, function(newValue, oldValue) {
        var monthNames = [
                "Janeiro", "Fevereiro", "Março",
                "Abril", "Maio", "Junho", "Julho",
                "Agosto", "Setembro", "Outubro",
                "Novembro", "Dezembro"
            ];
        var monthIndex = newValue.getMonth();
        var year = newValue.getFullYear();
        $scope.periodoFmt = year + "-" + pad((monthIndex + 1), 2);
        $scope.periodoExtenso = monthNames[monthIndex] + ' de ' + year;
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
        $dataProvider.readView('V_CHART_TEMPO_REVISAO_FICHAS', 'PERIODO = \'' + $scope.periodoFmt + '\'', function(data) {
            $scope.relacaoRevisaoFichas = data;
        });
        $scope.totalFichas = 110;
        $scope.totalFichasImplementacao = 110;
        $dataProvider.readRecord('SELECT COUNT(*) FROM V_FICHAS WHERE TIPO IN (1, 3) AND TO_CHAR(DATACRIACAO, \'YYYY-MM\') = \'' + $scope.periodoFmt + '\'', function(data) {
            $scope.totalFichasIncidentes = data[0];
            $dataProvider.readRecord('SELECT SUM(HORAS) FROM V_HORAS WHERE TIPO = \'Correção\' AND PERIODO = \'' + $scope.periodoFmt + '\'', function(data) {
                $scope.mediaHorasIncidente = (data[0] / $scope.totalFichasIncidentes).toFixed(2);
            });
        });
        $scope.totalHoras = Math.floor(((Math.abs(Math.sin(monthIndex + 1 / 4)) * 0.6) + 0.6) * 2360);
    }, false);
    // Gráficos NÃO dependentes do período
    $dataProvider.readView('V_CHART_TOTAL_HORAS', undefined, function(data) {
        $scope.incidenciaErros = [];
        var mes = 0;
        var ano = 2013;
        while(true) {
            mes++;
            if (mes > 12) {
                mes = 1;
                ano++;
            }
            var horas = Math.floor(((Math.abs(Math.sin(mes / 4)) * 0.6) + 0.6) * 2360);
            $scope.incidenciaErros.push(['Simulação', 'Total horas', pad(mes, 2) + '-' + ano, horas]);
            if (ano === 2015 && mes > 5) {
                break;
            }
        }
    });
    // Inicializa o período
//    $scope.periodo = new Date();
    $scope.periodo = new Date('2015-04');
});

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}