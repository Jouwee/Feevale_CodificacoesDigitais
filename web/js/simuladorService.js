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
