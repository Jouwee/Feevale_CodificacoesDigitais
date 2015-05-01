feevaleApp.controller('historicoCtrl', function ($scope, $dataProvider) {
    $dataProvider.readView('V_CHART_HISTORICO_INCIDENTES', function(data) {
        $scope.incidenciaErros = data;
    });
    $dataProvider.readView('V_CHART_RELACAO_REVISAO', function(data) {
        $scope.relacaoRevisao = data;
    });
});