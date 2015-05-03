feevaleApp.controller('historicoCtrl', function ($scope, $dataProvider) {
    $scope.$watch('periodo', function(newValue, oldValue) {
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
    }, false);
    
    $scope.name = 'hoi';
    $scope.name = 'hui';
    // Gráficos NÃO dependentes do período
    $dataProvider.readView('V_CHART_HISTORICO_INCIDENTES', undefined, function(data) {
        $scope.incidenciaErros = data;
    });
    $dataProvider.readView('V_CHART_RELACAO_REVISAO', undefined, function(data) {
        $scope.relacaoRevisao = data;
    });
    // Inicializa o período
    $scope.periodo = new Date();
});

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}