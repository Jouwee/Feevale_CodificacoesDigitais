feevaleApp.controller('historicoCtrl', function ($scope, $dataProvider) {
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
    }, false);
    // Gráficos NÃO dependentes do período
    $dataProvider.readView('V_CHART_HISTORICO_INCIDENTES', undefined, function(data) {
        $scope.incidenciaErros = data;
    });
    $dataProvider.readView('V_CHART_RELACAO_REVISAO', undefined, function(data) {
        $scope.relacaoRevisao = data;
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