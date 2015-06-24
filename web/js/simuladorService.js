angular.module('feevaleApp').factory('$simulador', function ($random, $rootScope) {
    var simulador = {};
    simulador.horasProducaoPorFicha = 8.09;
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
    // S
    simulador.getMediaRevisaoPorFicha = function (curvaRevisao) {
        var medias = [];
        var soma = 0;
        for (var i = 0; i < curvaRevisao.length; i++) {
            medias[i] = simulador.horasProducaoPorFicha * curvaRevisao[i][3] * (i / 10 + 0.05);
            soma += isNaN(medias[i]) ? 0 : medias[i];
        }
        return soma;
    };
    // Gera
    simulador.getCurvaTempoRevisaoFichas = function (pico) {
        var curva = [];
        var soma = 0;
        var numeroItens = pico;
        for (var i = 0; i < numeroItens; i++) {
            curva[i] = (i + 1) / numeroItens;
        }
        var numeroItens = 10 - pico;
        for (var i = 0; i < numeroItens; i++) {
            curva[(pico - i) + numeroItens - 1] = (i + 1) / numeroItens;
        }
        for(var i = 0; i < 10; i++) {
            soma += curva[i];
        }
        for(var i = 0; i < 10; i++) {
            curva[i] = curva[i] / soma;
        }
        // Desvios padrões encontrados:
        // %       Média     DP
        // 0 - 10 :0.29288   0.039184
        // 10- 20 :0.24679   0.022541
        // 20- 30 :0.12762   0.021280
        // 30- 40 :0.10525   0.014604
        // 40- 50 :0.09423   0.013626
        // 50- 60 :0.06250   0.009000
        // 60- 70 :0.04387   0.010907
        // 70- 80 :0.01400   0.000000
        // 80- 90 :0.01350   0.000500
        // 90- 100:-         -
        var desviosPadroes = [0.039184, 0.022541, 0.021280, 0.014604, 0.013626, 0.009000, 0.010907, 0.000000, 0.000500];
        // Aplica os desvios padrões
        for(var i = 0; i < 10; i++) {
            curva[i] = curva[i] + $random.getDesvio(desviosPadroes[i]);
        }
        return curva;
    };
    return simulador;
});
