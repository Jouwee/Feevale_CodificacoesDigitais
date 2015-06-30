feevaleApp.controller('historicoCtrl', function ($rootScope, $scope, $dataProvider) {
    $rootScope.pagina = 'historico';
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
        $dataProvider.readRecord('HORAS_IMPLEMENTACAO', $scope.periodoFmt, function(data) {
            $scope.totalHorasImplementacao = parseInt(data[0]);
        });
        $dataProvider.readRecord('HORAS_CORRECAO', $scope.periodoFmt, function(data) {
            $scope.totalHorasIncidentes = parseInt(data[0]);
        });
        $dataProvider.readView('V_CHART_RELACAO_REVISAO_INCID', $scope.periodoFmt, function(data) {
            $scope.relacaoRevisaoIncidentes = data;
        });
        $dataProvider.readView('V_CHART_TEMPO_REVISAO_FICHAS', $scope.periodoFmt, function(data) {
            $scope.relacaoRevisaoFichas = data;
        });
        $dataProvider.readRecord('FICHAS_IMPLEMENTACAO', $scope.periodoFmt, function(data) {
            $scope.totalFichasImplementacao = parseInt(data[0]);
            $scope.mediaHorasImplementacao = ($scope.totalHorasImplementacao / $scope.totalFichasImplementacao).toFixed(2);
        });
        $dataProvider.readRecord('FICHAS_CORRECAO', $scope.periodoFmt, function(data) {
            $scope.totalFichasIncidentes = parseInt(data[0]);
            $scope.mediaHorasIncidente = ($scope.totalHorasIncidentes / $scope.totalFichasIncidentes).toFixed(2);
        });
    }, false);
    // Gráficos NÃO dependentes do período
    $dataProvider.readView('V_CHART_TOTAL_HORAS', undefined, function(data) {
        $scope.incidenciaErros = data;
    });
    // Inicializa o período
//    $scope.periodo = new Date();
    $scope.periodo = new Date('2014-08');
});

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}